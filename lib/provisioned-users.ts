import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
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

interface ProvisionedUserStore {
  users: ProvisionedUserRecord[]
}

interface CreateProvisionedUserInput {
  user: Omit<ProvisionedManagedUser, "id" | "lastAccessAt"> & {
    id?: string
    lastAccessAt?: string
  }
  entities: ProvisionedEntity[]
  memberships: Array<Omit<ProvisionedMembership, "id" | "userId"> & { id?: string; userId?: string }>
  password?: string
}

const STORE_PATH = path.join(process.cwd(), "data", "provisioned-users.json")

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
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

export async function findProvisionedUserByEmail(email: string) {
  const store = await readStore()
  const normalizedEmail = normalizeEmail(email)

  return (
    store.users.find((entry) => normalizeEmail(entry.user.email) === normalizedEmail) || null
  )
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
  const store = await readStore()
  const normalizedEmail = normalizeEmail(input.user.email)

  const duplicate = store.users.find(
    (entry) => normalizeEmail(entry.user.email) === normalizedEmail,
  )

  if (duplicate) {
    throw new Error("Já existe um utilizador provisionado com este email.")
  }

  const userId = input.user.id || createId("user")
  const memberships = input.memberships.map((membership, index) => ({
    id: membership.id || createId("membership"),
    userId,
    entityId: membership.entityId,
    role: membership.role,
    isDefault: membership.isDefault ?? index === 0,
  }))

  const record: ProvisionedUserRecord = {
    user: {
      id: userId,
      name: input.user.name,
      email: normalizedEmail,
      title: input.user.title,
      platformRole: input.user.platformRole,
      status: input.user.status,
      phone: input.user.phone,
      lastAccessAt: input.user.status === "active"
        ? input.user.lastAccessAt || new Date().toISOString()
        : input.user.lastAccessAt,
    },
    entities: input.entities,
    memberships,
    credential: hashPassword(input.password || ""),
  }

  store.users.unshift(record)
  await writeStore(store)

  return record
}

export async function upsertProvisionedUser(input: CreateProvisionedUserInput) {
  const store = await readStore()
  const normalizedEmail = normalizeEmail(input.user.email)
  const existingRecord = store.users.find(
    (entry) =>
      entry.user.id === input.user.id ||
      normalizeEmail(entry.user.email) === normalizedEmail,
  )
  const userId =
    input.user.id ||
    existingRecord?.user.id ||
    createId("user")

  const memberships = input.memberships.map((membership, index) => ({
    id: membership.id || createId("membership"),
    userId,
    entityId: membership.entityId,
    role: membership.role,
    isDefault: membership.isDefault ?? index === 0,
  }))

  const record: ProvisionedUserRecord = {
    user: {
      id: userId,
      name: input.user.name,
      email: normalizedEmail,
      title: input.user.title,
      platformRole: input.user.platformRole,
      status: input.user.status,
      phone: input.user.phone,
      lastAccessAt: input.user.status === "active"
        ? input.user.lastAccessAt || new Date().toISOString()
        : input.user.lastAccessAt,
    },
    entities: input.entities,
    memberships,
    credential:
      input.password && input.password.length > 0
        ? hashPassword(input.password)
        : existingRecord?.credential || hashPassword("password-temporaria"),
  }

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

export async function deleteProvisionedUser(userId: string, email?: string) {
  const store = await readStore()
  const normalizedEmail = email ? normalizeEmail(email) : null

  store.users = store.users.filter(
    (entry) =>
      entry.user.id !== userId &&
      (!normalizedEmail || normalizeEmail(entry.user.email) !== normalizedEmail),
  )

  await writeStore(store)
}
