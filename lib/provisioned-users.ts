import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { Pool, type PoolClient } from "pg"
import { hashPassword, normalizeEmail, verifyPassword } from "@/lib/auth"

export interface ProvisionedEntity {
  id: string
  name: string
  legalName: string
  nif: string
  industry: string
  employeeCount: number
  status: "active" | "setup" | "paused"
  headquarters: string
  createdAt: string
}

export interface ProvisionedManagedUser {
  id: string
  name: string
  email: string
  title: string
  platformRole: "super_admin" | "user"
  status: "active" | "invited" | "inactive"
  phone?: string
  lastAccessAt?: string
}

export interface ProvisionedMembership {
  id: string
  userId: string
  entityId: string
  role: "owner" | "manager" | "analyst" | "viewer"
  isDefault: boolean
}

export interface ProvisionedUserRecord {
  user: ProvisionedManagedUser
  entities: ProvisionedEntity[]
  memberships: ProvisionedMembership[]
  credential: {
    salt: string
    hash: string
  }
}

export interface AccessManagementSnapshot {
  users: ProvisionedManagedUser[]
  entities: ProvisionedEntity[]
  memberships: ProvisionedMembership[]
}

interface ProvisionedUserStore {
  users: ProvisionedUserRecord[]
}

interface ProvisionedUserRow {
  user_id: string
  name: string
  email: string
  title: string
  platform_role: ProvisionedManagedUser["platformRole"]
  status: ProvisionedManagedUser["status"]
  phone: string | null
  last_access_at: Date | string | null
  credential_salt: string
  credential_hash: string
}

interface ManagedEntityRow {
  entity_id: string
  name: string
  legal_name: string
  nif: string
  industry: string
  employee_count: number
  status: ProvisionedEntity["status"]
  headquarters: string
  created_at: Date | string
}

interface ManagedMembershipRow {
  membership_id: string
  user_id: string
  entity_id: string
  role: ProvisionedMembership["role"]
  is_default: boolean
}

interface LegacyProvisionedUserRow {
  user_id: string
  entities: ProvisionedEntity[] | string | null
  memberships: ProvisionedMembership[] | string | null
}

type CreateProvisionedMembershipInput = Omit<ProvisionedMembership, "id" | "userId" | "isDefault"> & {
  id?: string
  userId?: string
  isDefault?: boolean
}

interface CreateProvisionedUserInput {
  user: Omit<ProvisionedManagedUser, "id" | "lastAccessAt"> & {
    id?: string
    lastAccessAt?: string
  }
  entities: ProvisionedEntity[]
  memberships: CreateProvisionedMembershipInput[]
  password?: string
}

type UpsertManagedEntityInput = Omit<ProvisionedEntity, "id" | "createdAt"> & {
  id?: string
  createdAt?: string
}

declare global {
  // eslint-disable-next-line no-var
  var __rhinovaProvisionedUsersPool: Pool | undefined
  // eslint-disable-next-line no-var
  var __rhinovaProvisionedUsersSchemaPromise: Promise<void> | undefined
}

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL?.trim()
  return value ? value : null
}

function hasDatabase() {
  return Boolean(getDatabaseUrl())
}

function getPool() {
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    return null
  }

  if (!globalThis.__rhinovaProvisionedUsersPool) {
    globalThis.__rhinovaProvisionedUsersPool = new Pool({
      connectionString: databaseUrl,
      max: 4,
    })
  }

  return globalThis.__rhinovaProvisionedUsersPool
}

async function withDatabaseClient<T>(handler: (client: PoolClient) => Promise<T>) {
  const pool = getPool()

  if (!pool) {
    throw new Error("DATABASE_URL não configurada.")
  }

  await ensureDatabaseSchema()

  const client = await pool.connect()

  try {
    return await handler(client)
  } finally {
    client.release()
  }
}

async function withTransaction<T>(handler: (client: PoolClient) => Promise<T>) {
  return withDatabaseClient(async (client) => {
    await client.query("begin")

    try {
      const result = await handler(client)
      await client.query("commit")
      return result
    } catch (error) {
      await client.query("rollback")
      throw error
    }
  })
}

function resolveStorePath() {
  if (process.env.PROVISIONED_USERS_STORE_PATH) {
    return process.env.PROVISIONED_USERS_STORE_PATH
  }

  if (
    process.env.VERCEL === "1" ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  ) {
    return path.join("/tmp", "rhinova", "provisioned-users.json")
  }

  return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "provisioned-users.json")
}

const STORE_PATH = resolveStorePath()

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  )
}

function parseJsonValue<T>(value: T | string | null | undefined, fallback: T) {
  if (value == null) {
    return fallback
  }

  return (typeof value === "string" ? JSON.parse(value) : value) as T
}

function mapUserRow(row: ProvisionedUserRow): ProvisionedManagedUser {
  return {
    id: row.user_id,
    name: row.name,
    email: row.email,
    title: row.title,
    platformRole: row.platform_role,
    status: row.status,
    phone: row.phone || undefined,
    lastAccessAt:
      row.last_access_at instanceof Date
        ? row.last_access_at.toISOString()
        : row.last_access_at || undefined,
  }
}

function mapEntityRow(row: ManagedEntityRow): ProvisionedEntity {
  return {
    id: row.entity_id,
    name: row.name,
    legalName: row.legal_name,
    nif: row.nif,
    industry: row.industry,
    employeeCount: row.employee_count,
    status: row.status,
    headquarters: row.headquarters,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
  }
}

function mapMembershipRow(row: ManagedMembershipRow): ProvisionedMembership {
  return {
    id: row.membership_id,
    userId: row.user_id,
    entityId: row.entity_id,
    role: row.role,
    isDefault: row.is_default,
  }
}

function normalizeMemberships(
  userId: string,
  memberships: CreateProvisionedMembershipInput[],
) {
  return memberships.map((membership, index) => ({
    id: membership.id || createId("membership"),
    userId,
    entityId: membership.entityId,
    role: membership.role,
    isDefault: membership.isDefault ?? index === 0,
  }))
}

function createRecord(input: {
  userId: string
  user: CreateProvisionedUserInput["user"]
  entities: ProvisionedEntity[]
  memberships: ProvisionedMembership[]
  credential: {
    salt: string
    hash: string
  }
}) {
  return {
    user: {
      id: input.userId,
      name: input.user.name,
      email: normalizeEmail(input.user.email),
      title: input.user.title,
      platformRole: input.user.platformRole,
      status: input.user.status,
      phone: input.user.phone,
      lastAccessAt:
        input.user.status === "active"
          ? input.user.lastAccessAt || new Date().toISOString()
          : input.user.lastAccessAt,
    },
    entities: input.entities,
    memberships: input.memberships,
    credential: input.credential,
  } satisfies ProvisionedUserRecord
}

async function ensureStoreFile() {
  await mkdir(path.dirname(STORE_PATH), { recursive: true })

  try {
    await readFile(STORE_PATH, "utf8")
  } catch {
    const initialState: ProvisionedUserStore = { users: [] }
    await writeFile(STORE_PATH, JSON.stringify(initialState, null, 2), "utf8")
  }
}

async function readStore() {
  await ensureStoreFile()
  const raw = await readFile(STORE_PATH, "utf8")
  return JSON.parse(raw) as ProvisionedUserStore
}

async function writeStore(store: ProvisionedUserStore) {
  await ensureStoreFile()
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8")
}

async function ensureDatabaseSchema() {
  const pool = getPool()

  if (!pool) {
    return
  }

  if (!globalThis.__rhinovaProvisionedUsersSchemaPromise) {
    globalThis.__rhinovaProvisionedUsersSchemaPromise = (async () => {
      const client = await pool.connect()

      try {
        await client.query("begin")
        await client.query(`
          create table if not exists provisioned_users (
            user_id text primary key,
            name text not null,
            email text not null unique,
            title text not null,
            platform_role text not null,
            status text not null,
            phone text,
            last_access_at timestamptz,
            entities jsonb not null default '[]'::jsonb,
            memberships jsonb not null default '[]'::jsonb,
            credential_salt text not null,
            credential_hash text not null,
            created_at timestamptz not null default now(),
            updated_at timestamptz not null default now()
          );

          create table if not exists managed_entities (
            entity_id text primary key,
            name text not null,
            legal_name text not null,
            nif text not null,
            industry text not null,
            employee_count integer not null,
            status text not null,
            headquarters text not null,
            created_at timestamptz not null,
            updated_at timestamptz not null default now()
          );

          create table if not exists managed_memberships (
            membership_id text primary key,
            user_id text not null references provisioned_users(user_id) on delete cascade,
            entity_id text not null references managed_entities(entity_id) on delete cascade,
            role text not null,
            is_default boolean not null default false,
            created_at timestamptz not null default now(),
            updated_at timestamptz not null default now()
          );

          create unique index if not exists managed_memberships_user_entity_idx
          on managed_memberships(user_id, entity_id);
        `)

        await migrateLegacyDatabase(client)
        await migrateLegacyFileStore(client)

        await client.query("commit")
      } catch (error) {
        await client.query("rollback")
        throw error
      } finally {
        client.release()
      }
    })()
  }

  await globalThis.__rhinovaProvisionedUsersSchemaPromise
}

async function migrateLegacyDatabase(client: PoolClient) {
  const counts = await client.query<{
    entity_count: string
    membership_count: string
  }>(`
    select
      (select count(*)::text from managed_entities) as entity_count,
      (select count(*)::text from managed_memberships) as membership_count
  `)

  const entityCount = Number(counts.rows[0]?.entity_count || "0")
  const membershipCount = Number(counts.rows[0]?.membership_count || "0")

  if (entityCount > 0 || membershipCount > 0) {
    return
  }

  const legacyRows = await client.query<LegacyProvisionedUserRow>(`
    select user_id, entities, memberships
    from provisioned_users
    where jsonb_array_length(entities) > 0 or jsonb_array_length(memberships) > 0
  `)

  for (const row of legacyRows.rows) {
    const entities = parseJsonValue<ProvisionedEntity[]>(row.entities, [])
    const memberships = parseJsonValue<ProvisionedMembership[]>(row.memberships, [])

    await upsertEntitiesInDatabase(client, entities)
    await replaceMembershipsInDatabase(client, row.user_id, memberships)
  }
}

async function migrateLegacyFileStore(client: PoolClient) {
  const result = await client.query<{ user_count: string }>(`
    select count(*)::text as user_count from provisioned_users
  `)

  if (Number(result.rows[0]?.user_count || "0") > 0) {
    return
  }

  try {
    const store = await readStore()

    for (const record of store.users) {
      await upsertUserRecordInDatabase(client, record)
    }
  } catch {
    // Ignore missing or unreadable local stores during bootstrap.
  }
}

async function listUsersFromDatabase(client: PoolClient) {
  const result = await client.query<ProvisionedUserRow>(`
    select
      user_id,
      name,
      email,
      title,
      platform_role,
      status,
      phone,
      last_access_at,
      credential_salt,
      credential_hash
    from provisioned_users
    order by lower(name), lower(email)
  `)

  return result.rows.map(mapUserRow)
}

async function listEntitiesFromDatabase(client: PoolClient) {
  const result = await client.query<ManagedEntityRow>(`
    select
      entity_id,
      name,
      legal_name,
      nif,
      industry,
      employee_count,
      status,
      headquarters,
      created_at
    from managed_entities
    order by lower(name), entity_id
  `)

  return result.rows.map(mapEntityRow)
}

async function listMembershipsFromDatabase(client: PoolClient) {
  const result = await client.query<ManagedMembershipRow>(`
    select
      membership_id,
      user_id,
      entity_id,
      role,
      is_default
    from managed_memberships
    order by user_id, is_default desc, membership_id
  `)

  return result.rows.map(mapMembershipRow)
}

async function listUserMembershipsFromDatabase(client: PoolClient, userId: string) {
  const result = await client.query<ManagedMembershipRow>(
    `
      select
        membership_id,
        user_id,
        entity_id,
        role,
        is_default
      from managed_memberships
      where user_id = $1
      order by is_default desc, membership_id
    `,
    [userId],
  )

  return result.rows.map(mapMembershipRow)
}

async function listEntitiesForUserFromDatabase(client: PoolClient, userId: string) {
  const result = await client.query<ManagedEntityRow>(
    `
      select
        e.entity_id,
        e.name,
        e.legal_name,
        e.nif,
        e.industry,
        e.employee_count,
        e.status,
        e.headquarters,
        e.created_at
      from managed_entities e
      inner join managed_memberships m on m.entity_id = e.entity_id
      where m.user_id = $1
      order by lower(e.name), e.entity_id
    `,
    [userId],
  )

  return result.rows.map(mapEntityRow)
}

async function findUserRowByEmail(client: PoolClient, email: string) {
  const result = await client.query<ProvisionedUserRow>(
    `
      select
        user_id,
        name,
        email,
        title,
        platform_role,
        status,
        phone,
        last_access_at,
        credential_salt,
        credential_hash
      from provisioned_users
      where email = $1
      limit 1
    `,
    [normalizeEmail(email)],
  )

  return result.rows[0] || null
}

async function findUserRowByIdOrEmail(
  client: PoolClient,
  input: { userId?: string; email: string },
) {
  const result = await client.query<ProvisionedUserRow>(
    `
      select
        user_id,
        name,
        email,
        title,
        platform_role,
        status,
        phone,
        last_access_at,
        credential_salt,
        credential_hash
      from provisioned_users
      where user_id = $1 or email = $2
      limit 1
    `,
    [input.userId || "", normalizeEmail(input.email)],
  )

  return result.rows[0] || null
}

async function readUserRecordFromDatabase(client: PoolClient, userRow: ProvisionedUserRow) {
  const user = mapUserRow(userRow)
  const memberships =
    user.platformRole === "super_admin"
      ? []
      : await listUserMembershipsFromDatabase(client, user.id)
  const entities =
    user.platformRole === "super_admin"
      ? await listEntitiesFromDatabase(client)
      : await listEntitiesForUserFromDatabase(client, user.id)

  return {
    user,
    entities,
    memberships,
    credential: {
      salt: userRow.credential_salt,
      hash: userRow.credential_hash,
    },
  } satisfies ProvisionedUserRecord
}

async function upsertEntitiesInDatabase(client: PoolClient, entities: ProvisionedEntity[]) {
  for (const entity of entities) {
    await client.query(
      `
        insert into managed_entities (
          entity_id,
          name,
          legal_name,
          nif,
          industry,
          employee_count,
          status,
          headquarters,
          created_at,
          updated_at
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
        on conflict (entity_id) do update
        set
          name = excluded.name,
          legal_name = excluded.legal_name,
          nif = excluded.nif,
          industry = excluded.industry,
          employee_count = excluded.employee_count,
          status = excluded.status,
          headquarters = excluded.headquarters,
          created_at = excluded.created_at,
          updated_at = now()
      `,
      [
        entity.id,
        entity.name,
        entity.legalName,
        entity.nif,
        entity.industry,
        entity.employeeCount,
        entity.status,
        entity.headquarters,
        entity.createdAt,
      ],
    )
  }
}

async function replaceMembershipsInDatabase(
  client: PoolClient,
  userId: string,
  memberships: ProvisionedMembership[],
) {
  await client.query("delete from managed_memberships where user_id = $1", [userId])

  for (const membership of memberships) {
    await client.query(
      `
        insert into managed_memberships (
          membership_id,
          user_id,
          entity_id,
          role,
          is_default,
          updated_at
        )
        values ($1, $2, $3, $4, $5, now())
      `,
      [
        membership.id,
        userId,
        membership.entityId,
        membership.role,
        membership.isDefault,
      ],
    )
  }
}

async function upsertUserRecordInDatabase(client: PoolClient, record: ProvisionedUserRecord) {
  await client.query(
    `
      insert into provisioned_users (
        user_id,
        name,
        email,
        title,
        platform_role,
        status,
        phone,
        last_access_at,
        entities,
        memberships,
        credential_salt,
        credential_hash,
        updated_at
      )
      values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11, $12, now()
      )
      on conflict (user_id) do update
      set
        name = excluded.name,
        email = excluded.email,
        title = excluded.title,
        platform_role = excluded.platform_role,
        status = excluded.status,
        phone = excluded.phone,
        last_access_at = excluded.last_access_at,
        entities = excluded.entities,
        memberships = excluded.memberships,
        credential_salt = excluded.credential_salt,
        credential_hash = excluded.credential_hash,
        updated_at = now()
    `,
    [
      record.user.id,
      record.user.name,
      record.user.email,
      record.user.title,
      record.user.platformRole,
      record.user.status,
      record.user.phone || null,
      record.user.lastAccessAt || null,
      JSON.stringify(record.entities),
      JSON.stringify(record.memberships),
      record.credential.salt,
      record.credential.hash,
    ],
  )

  await upsertEntitiesInDatabase(client, record.entities)
  await replaceMembershipsInDatabase(client, record.user.id, record.memberships)
}

function deriveSnapshotFromStore(store: ProvisionedUserStore): AccessManagementSnapshot {
  const entitiesById = new Map<string, ProvisionedEntity>()
  const membershipsById = new Map<string, ProvisionedMembership>()

  for (const record of store.users) {
    record.entities.forEach((entity) => entitiesById.set(entity.id, entity))
    record.memberships.forEach((membership) => membershipsById.set(membership.id, membership))
  }

  return {
    users: store.users.map((record) => record.user),
    entities: Array.from(entitiesById.values()),
    memberships: Array.from(membershipsById.values()),
  }
}

function buildUserRecordsFromSnapshot(
  snapshot: AccessManagementSnapshot,
  previousRecords: ProvisionedUserRecord[],
) {
  const previousByUserId = new Map(previousRecords.map((record) => [record.user.id, record]))

  return snapshot.users.map((user) => {
    const memberships = snapshot.memberships.filter((membership) => membership.userId === user.id)
    const entityIds = new Set(memberships.map((membership) => membership.entityId))
    const entities =
      user.platformRole === "super_admin"
        ? snapshot.entities
        : snapshot.entities.filter((entity) => entityIds.has(entity.id))
    const previous = previousByUserId.get(user.id)

    return {
      user,
      entities,
      memberships,
      credential: previous?.credential || hashPassword("password-temporaria"),
    } satisfies ProvisionedUserRecord
  })
}

async function persistSnapshotToStore(snapshot: AccessManagementSnapshot) {
  const existingStore = await readStore()
  const users = buildUserRecordsFromSnapshot(snapshot, existingStore.users)

  await writeStore({ users })
}

export async function listAccessManagementState() {
  if (!hasDatabase()) {
    const store = await readStore()
    return deriveSnapshotFromStore(store)
  }

  return withDatabaseClient(async (client) => ({
    users: await listUsersFromDatabase(client),
    entities: await listEntitiesFromDatabase(client),
    memberships: await listMembershipsFromDatabase(client),
  }))
}

export async function findProvisionedUserByEmail(email: string) {
  if (!hasDatabase()) {
    const store = await readStore()
    const normalizedEmail = normalizeEmail(email)

    return (
      store.users.find((entry) => normalizeEmail(entry.user.email) === normalizedEmail) || null
    )
  }

  return withDatabaseClient(async (client) => {
    const userRow = await findUserRowByEmail(client, email)
    return userRow ? readUserRecordFromDatabase(client, userRow) : null
  })
}

export async function verifyProvisionedUserCredentials(email: string, password: string) {
  const record = await findProvisionedUserByEmail(email)

  if (!record || record.user.status !== "active") {
    return null
  }

  const isValid = verifyPassword(
    password,
    record.credential.salt,
    record.credential.hash,
  )

  return isValid ? record : null
}

export async function createProvisionedUser(input: CreateProvisionedUserInput) {
  const normalizedEmail = normalizeEmail(input.user.email)

  if (!hasDatabase()) {
    const store = await readStore()
    const duplicate = store.users.find(
      (entry) => normalizeEmail(entry.user.email) === normalizedEmail,
    )

    if (duplicate) {
      throw new Error("Já existe um utilizador provisionado com este email.")
    }

    const userId = input.user.id || createId("user")
    const memberships = normalizeMemberships(userId, input.memberships)
    const record = createRecord({
      userId,
      user: input.user,
      entities: input.entities,
      memberships,
      credential: hashPassword(input.password || ""),
    })

    store.users.unshift(record)
    await writeStore(store)

    return record
  }

  return withTransaction(async (client) => {
    const duplicate = await findUserRowByEmail(client, normalizedEmail)

    if (duplicate) {
      throw new Error("Já existe um utilizador provisionado com este email.")
    }

    const userId = input.user.id || createId("user")
    const memberships = normalizeMemberships(userId, input.memberships)
    const record = createRecord({
      userId,
      user: input.user,
      entities: input.entities,
      memberships,
      credential: hashPassword(input.password || ""),
    })

    try {
      await upsertUserRecordInDatabase(client, record)
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new Error("Já existe um utilizador provisionado com este email.")
      }

      throw error
    }

    return record
  })
}

export async function upsertProvisionedUser(input: CreateProvisionedUserInput) {
  if (!hasDatabase()) {
    const store = await readStore()
    const normalizedEmail = normalizeEmail(input.user.email)
    const existingRecord = store.users.find(
      (entry) =>
        entry.user.id === input.user.id ||
        normalizeEmail(entry.user.email) === normalizedEmail,
    )
    const userId = input.user.id || existingRecord?.user.id || createId("user")
    const memberships = normalizeMemberships(userId, input.memberships)
    const credential =
      input.password && input.password.length > 0
        ? hashPassword(input.password)
        : existingRecord?.credential || hashPassword("password-temporaria")
    const record = createRecord({
      userId,
      user: input.user,
      entities: input.entities,
      memberships,
      credential,
    })

    const existingIndex = store.users.findIndex(
      (entry) =>
        entry.user.id === userId ||
        normalizeEmail(entry.user.email) === normalizedEmail,
    )

    if (existingIndex >= 0) {
      store.users[existingIndex] = record
    } else {
      store.users.unshift(record)
    }

    await writeStore(store)

    return record
  }

  return withTransaction(async (client) => {
    const existingRow = await findUserRowByIdOrEmail(client, {
      userId: input.user.id,
      email: input.user.email,
    })
    const existingRecord = existingRow
      ? await readUserRecordFromDatabase(client, existingRow)
      : null
    const userId = input.user.id || existingRecord?.user.id || createId("user")
    const memberships = normalizeMemberships(userId, input.memberships)
    const credential =
      input.password && input.password.length > 0
        ? hashPassword(input.password)
        : existingRecord?.credential || hashPassword("password-temporaria")
    const record = createRecord({
      userId,
      user: input.user,
      entities: input.entities,
      memberships,
      credential,
    })

    try {
      await upsertUserRecordInDatabase(client, record)
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new Error("Já existe um utilizador provisionado com este email.")
      }

      throw error
    }

    return record
  })
}

export async function deleteProvisionedUser(userId: string, email?: string) {
  if (!hasDatabase()) {
    const store = await readStore()
    const normalizedEmail = email ? normalizeEmail(email) : null

    store.users = store.users.filter(
      (entry) =>
        entry.user.id !== userId &&
        (!normalizedEmail || normalizeEmail(entry.user.email) !== normalizedEmail),
    )

    await writeStore(store)
    return
  }

  await withTransaction(async (client) => {
    await client.query(
      `
        delete from provisioned_users
        where user_id = $1 or ($2::text is not null and email = $2)
      `,
      [userId, email ? normalizeEmail(email) : null],
    )
  })
}

export async function upsertManagedEntity(input: UpsertManagedEntityInput) {
  const entity: ProvisionedEntity = {
    id: input.id || createId("entity"),
    name: input.name,
    legalName: input.legalName,
    nif: input.nif,
    industry: input.industry,
    employeeCount: input.employeeCount,
    status: input.status,
    headquarters: input.headquarters,
    createdAt: input.createdAt || new Date().toISOString(),
  }

  if (!hasDatabase()) {
    const store = await readStore()
    const snapshot = deriveSnapshotFromStore(store)
    const nextEntities = snapshot.entities.some((item) => item.id === entity.id)
      ? snapshot.entities.map((item) => (item.id === entity.id ? entity : item))
      : [entity, ...snapshot.entities]

    await persistSnapshotToStore({
      ...snapshot,
      entities: nextEntities,
    })

    return entity
  }

  await withTransaction(async (client) => {
    await upsertEntitiesInDatabase(client, [entity])
  })

  return entity
}

export async function deleteManagedEntity(entityId: string) {
  if (!hasDatabase()) {
    const store = await readStore()
    const snapshot = deriveSnapshotFromStore(store)

    await persistSnapshotToStore({
      users: snapshot.users,
      entities: snapshot.entities.filter((entity) => entity.id !== entityId),
      memberships: snapshot.memberships.filter((membership) => membership.entityId !== entityId),
    })

    return
  }

  await withTransaction(async (client) => {
    await client.query("delete from managed_entities where entity_id = $1", [entityId])
  })
}

export async function updateManagedMembershipRole(membershipId: string, role: ProvisionedMembership["role"]) {
  if (!hasDatabase()) {
    const store = await readStore()
    const snapshot = deriveSnapshotFromStore(store)

    await persistSnapshotToStore({
      ...snapshot,
      memberships: snapshot.memberships.map((membership) =>
        membership.id === membershipId ? { ...membership, role } : membership,
      ),
    })

    return
  }

  await withTransaction(async (client) => {
    await client.query(
      `
        update managed_memberships
        set role = $2, updated_at = now()
        where membership_id = $1
      `,
      [membershipId, role],
    )
  })
}

export async function setManagedUserDefaultEntity(userId: string, entityId: string) {
  if (!hasDatabase()) {
    const store = await readStore()
    const snapshot = deriveSnapshotFromStore(store)

    await persistSnapshotToStore({
      ...snapshot,
      memberships: snapshot.memberships.map((membership) =>
        membership.userId === userId
          ? { ...membership, isDefault: membership.entityId === entityId }
          : membership,
      ),
    })

    return
  }

  await withTransaction(async (client) => {
    await client.query(
      `
        update managed_memberships
        set
          is_default = case when entity_id = $2 then true else false end,
          updated_at = now()
        where user_id = $1
      `,
      [userId, entityId],
    )
  })
}
