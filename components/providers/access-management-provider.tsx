"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type EntityRole = "owner" | "manager" | "analyst" | "viewer"
export type PlatformRole = "super_admin" | "user"
export type ManagedUserStatus = "active" | "invited" | "inactive"
export type ManagedEntityStatus = "active" | "setup" | "paused"

export interface ManagedEntity {
  id: string
  name: string
  legalName: string
  nif: string
  industry: string
  employeeCount: number
  status: ManagedEntityStatus
  headquarters: string
  createdAt: Date
}

export interface ManagedUser {
  id: string
  name: string
  email: string
  title: string
  platformRole: PlatformRole
  status: ManagedUserStatus
  phone?: string
  lastAccessAt?: Date
}

export interface EntityMembership {
  id: string
  userId: string
  entityId: string
  role: EntityRole
  isDefault: boolean
}

interface AccessManagementState {
  currentUserId: string
  activeEntityId: string | null
  entities: ManagedEntity[]
  users: ManagedUser[]
  memberships: EntityMembership[]
}

interface CreateEntityPayload {
  name: string
  legalName: string
  nif: string
  industry: string
  employeeCount: number
  headquarters: string
}

interface UpdateEntityPayload extends CreateEntityPayload {
  status: ManagedEntityStatus
}

interface CreateManagedUserPayload {
  name: string
  email: string
  title: string
  platformRole: PlatformRole
  phone?: string
  status: ManagedUserStatus
  password: string
  memberships: Array<{
    entityId: string
    role: EntityRole
    isDefault?: boolean
  }>
}

interface ProvisionedManagedUserPayload {
  user: (Omit<ManagedUser, "lastAccessAt"> & { lastAccessAt?: string }) | null
  entities: Array<Omit<ManagedEntity, "createdAt"> & { createdAt: string }>
  memberships: EntityMembership[]
}

interface AccessManagementContextValue {
  state: AccessManagementState
  isReady: boolean
  currentUser: ManagedUser | null
  activeEntity: ManagedEntity | null
  isSuperAdmin: boolean
  currentUserEntities: ManagedEntity[]
  currentUserMemberships: EntityMembership[]
  createEntity: (payload: CreateEntityPayload) => ManagedEntity
  updateEntity: (entityId: string, payload: UpdateEntityPayload) => ManagedEntity | null
  deleteEntity: (entityId: string) => void
  createManagedUser: (payload: CreateManagedUserPayload) => Promise<ManagedUser>
  updateManagedUser: (userId: string, payload: Omit<CreateManagedUserPayload, "password">) => Promise<ManagedUser>
  deleteManagedUser: (userId: string) => Promise<void>
  provisionManagedUserAccess: (userId: string, password: string) => Promise<void>
  setActiveEntity: (entityId: string) => void
  signInAsManagedUser: (email: string, password: string, remember?: boolean) => Promise<ManagedUser | null>
  signOut: () => Promise<void>
  assignEntityToUser: (userId: string, entityId: string, role: EntityRole) => void
  updateMembershipRole: (membershipId: string, role: EntityRole) => void
  setDefaultEntityForUser: (userId: string, entityId: string) => void
  getMembershipsForUser: (userId: string) => EntityMembership[]
  getEntitiesForUser: (userId: string) => ManagedEntity[]
}

const STORAGE_KEY = "rhinova-access-management-v2"
const LEGACY_SEEDED_ENTITY_IDS = new Set([
  "entity-rhinova",
  "entity-atlantico",
  "entity-lumina",
])
const LEGACY_SEEDED_USER_EMAILS = new Set([
  "maria.santos@empresa.pt",
  "pedro.ferreira@empresa.pt",
  "ana.costa@empresa.pt",
  "joao.silva@empresa.pt",
])

const emptyState: AccessManagementState = {
  currentUserId: "",
  activeEntityId: null,
  entities: [],
  users: [],
  memberships: [],
}

const roleLabels: Record<EntityRole, string> = {
  owner: "Owner",
  manager: "Gestor RH",
  analyst: "Analista RH",
  viewer: "Consulta",
}

const roleOrder: EntityRole[] = ["owner", "manager", "analyst", "viewer"]

const platformRoleLabels: Record<PlatformRole, string> = {
  super_admin: "Super Admin",
  user: "Utilizador",
}

export { platformRoleLabels, roleLabels, roleOrder }

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function createSeedState(): AccessManagementState {
  const users: ManagedUser[] = [
    {
      id: "user-super-admin",
      name: "Rhinova Super Admin",
      email: "admin@rhinova.pt",
      title: "Platform Super Admin",
      platformRole: "super_admin",
      status: "active",
      phone: "+351 910 000 001",
      lastAccessAt: new Date("2026-06-08T15:20:00"),
    },
  ]

  return {
    currentUserId: "",
    activeEntityId: null,
    entities: [],
    users,
    memberships: [],
  }
}

function ensurePlatformAccess(state: AccessManagementState): AccessManagementState {
  const seed = createSeedState()
  const seededSuperAdmin = seed.users.find((user) => user.email === "admin@rhinova.pt")

  if (!seededSuperAdmin) {
    return state
  }

  const hasSeededSuperAdmin = state.users.some(
    (user) => user.email.toLowerCase() === seededSuperAdmin.email.toLowerCase(),
  )

  if (hasSeededSuperAdmin) {
    return state
  }

  return {
    ...state,
    users: [seededSuperAdmin, ...state.users],
  }
}

function removeLegacySeedData(state: AccessManagementState): AccessManagementState {
  const filteredEntities = state.entities.filter(
    (entity) => !LEGACY_SEEDED_ENTITY_IDS.has(entity.id),
  )
  const filteredUsers = state.users.filter((user) => {
    if (user.email.toLowerCase() === "admin@rhinova.pt") {
      return true
    }

    return !LEGACY_SEEDED_USER_EMAILS.has(user.email.toLowerCase())
  })
  const validEntityIds = new Set(filteredEntities.map((entity) => entity.id))
  const validUserIds = new Set(filteredUsers.map((user) => user.id))
  const filteredMemberships = state.memberships.filter(
    (membership) =>
      validEntityIds.has(membership.entityId) &&
      validUserIds.has(membership.userId),
  )

  return {
    ...state,
    activeEntityId:
      state.activeEntityId && validEntityIds.has(state.activeEntityId)
        ? state.activeEntityId
        : filteredEntities[0]?.id || null,
    currentUserId:
      state.currentUserId && validUserIds.has(state.currentUserId)
        ? state.currentUserId
        : "",
    entities: filteredEntities,
    users: filteredUsers,
    memberships: filteredMemberships,
  }
}

function resolveActiveEntityId(state: AccessManagementState, user: ManagedUser) {
  const defaultMembership = state.memberships.find(
    (membership) => membership.userId === user.id && membership.isDefault,
  )
  const fallbackMembership = state.memberships.find(
    (membership) => membership.userId === user.id,
  )

  return user.platformRole === "super_admin"
    ? state.activeEntityId || state.entities[0]?.id || null
    : defaultMembership?.entityId || fallbackMembership?.entityId || null
}

function applyAuthenticatedSession(
  state: AccessManagementState,
  email: string | null,
): AccessManagementState {
  if (!email) {
    return {
      ...state,
      currentUserId: "",
      activeEntityId: null,
    }
  }

  const user = state.users.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
  )

  if (!user) {
    return {
      ...state,
      currentUserId: "",
      activeEntityId: null,
    }
  }

  return {
    ...state,
    currentUserId: user.id,
    activeEntityId: resolveActiveEntityId(state, user),
    users: state.users.map((item) =>
      item.id === user.id && item.status === "active"
        ? { ...item, lastAccessAt: new Date() }
        : item,
    ),
  }
}

function mergeProvisionedManagedUser(
  state: AccessManagementState,
  payload: ProvisionedManagedUserPayload,
): AccessManagementState {
  if (!payload.user) {
    return state
  }

  const hydratedUser: ManagedUser = {
    ...payload.user,
    lastAccessAt: payload.user.lastAccessAt ? new Date(payload.user.lastAccessAt) : undefined,
  }
  const normalizedEmail = hydratedUser.email.toLowerCase()
  const entitiesById = new Map(
    state.entities.map((entity) => [entity.id, entity]),
  )

  payload.entities.forEach((entity) => {
    entitiesById.set(entity.id, {
      ...entity,
      createdAt: new Date(entity.createdAt),
    })
  })

  const nextUsers = state.users.some(
    (user) => user.email.toLowerCase() === normalizedEmail,
  )
    ? state.users.map((user) =>
        user.email.toLowerCase() === normalizedEmail ? hydratedUser : user,
      )
    : [hydratedUser, ...state.users]

  return {
    ...state,
    entities: Array.from(entitiesById.values()),
    users: nextUsers,
    memberships: [
      ...state.memberships.filter((membership) => membership.userId !== hydratedUser.id),
      ...payload.memberships,
    ],
  }
}

function serializeState(state: AccessManagementState) {
  return JSON.stringify(state)
}

function reviveState(raw: string | null): AccessManagementState | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as AccessManagementState
    return removeLegacySeedData({
      ...parsed,
      entities: parsed.entities.map((entity) => ({
        ...entity,
        createdAt: new Date(entity.createdAt),
      })),
      users: parsed.users.map((user) => ({
        ...user,
        lastAccessAt: user.lastAccessAt ? new Date(user.lastAccessAt) : undefined,
      })),
    })
  } catch {
    return null
  }
}

function persistState(state: AccessManagementState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, serializeState(state))
}

const AccessManagementContext = createContext<AccessManagementContextValue | null>(null)

export function AccessManagementProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, setState] = useState<AccessManagementState>(emptyState)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      const stored = reviveState(window.localStorage.getItem(STORAGE_KEY))
      let baseState = ensurePlatformAccess(stored || createSeedState())

      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        })

        const payload = response.ok
          ? ((await response.json()) as { authenticated?: boolean; email?: string })
          : null
        const authenticatedEmail = payload?.authenticated ? payload.email || null : null

        if (authenticatedEmail) {
          const meResponse = await fetch("/api/auth/me", {
            cache: "no-store",
          })

          if (meResponse.ok) {
            const mePayload = (await meResponse.json()) as ProvisionedManagedUserPayload & {
              authenticated?: boolean
            }
            baseState = mergeProvisionedManagedUser(baseState, {
              user: mePayload.user,
              entities: mePayload.entities || [],
              memberships: mePayload.memberships || [],
            })
          }
        }

        const next = applyAuthenticatedSession(
          baseState,
          authenticatedEmail,
        )

        if (!isMounted) return

        setState(next)
        persistState(next)
      } catch {
        const next = applyAuthenticatedSession(baseState, null)

        if (!isMounted) return

        setState(next)
        persistState(next)
      } finally {
        if (isMounted) {
          setIsReady(true)
        }
      }
    }

    void initialize()

    return () => {
      isMounted = false
    }
  }, [])

  const commit = (updater: AccessManagementState | ((previous: AccessManagementState) => AccessManagementState)) => {
    setState((previous) => {
      const next = typeof updater === "function" ? updater(previous) : updater
      persistState(next)
      return next
    })
  }

  const createEntity = (payload: CreateEntityPayload) => {
    const entity: ManagedEntity = {
      id: createId("entity"),
      name: payload.name,
      legalName: payload.legalName,
      nif: payload.nif,
      industry: payload.industry,
      employeeCount: payload.employeeCount,
      status: "setup",
      headquarters: payload.headquarters,
      createdAt: new Date(),
    }

    commit((previous) => ({
      ...previous,
      entities: [entity, ...previous.entities],
    }))

    return entity
  }

  const updateEntity = (entityId: string, payload: UpdateEntityPayload) => {
    const currentEntity = state.entities.find((entity) => entity.id === entityId)
    if (!currentEntity) return null

    const updatedEntity: ManagedEntity = {
      ...currentEntity,
      ...payload,
    }

    commit((previous) => ({
      ...previous,
      entities: previous.entities.map((entity) =>
        entity.id === entityId ? updatedEntity : entity,
      ),
    }))

    return updatedEntity
  }

  const deleteEntity = (entityId: string) => {
    commit((previous) => {
      const remainingEntities = previous.entities.filter((entity) => entity.id !== entityId)
      const remainingMemberships = previous.memberships.filter((membership) => membership.entityId !== entityId)
      const activeEntityId =
        previous.activeEntityId === entityId ? remainingEntities[0]?.id || null : previous.activeEntityId

      return {
        ...previous,
        activeEntityId,
        entities: remainingEntities,
        memberships: remainingMemberships,
      }
    })
  }

  const createManagedUser = async (payload: CreateManagedUserPayload) => {
    const response = await fetch("/api/auth/provision-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        name: payload.name,
        email: payload.email,
        title: payload.title,
        phone: payload.phone,
        platformRole: payload.platformRole,
        status: payload.status,
        password: payload.password,
        memberships: payload.memberships,
        entities: state.entities.map((entity) => ({
          ...entity,
          createdAt: entity.createdAt.toISOString(),
        })),
      }),
    })

    const result = (await response.json()) as
      | ({ ok: true } & ProvisionedManagedUserPayload)
      | { error?: string }

    if (!response.ok || !("ok" in result)) {
      throw new Error(result.error || "Não foi possível criar o user.")
    }

    const provisionedPayload = {
      user: result.user,
      entities: result.entities,
      memberships: result.memberships,
    }

    commit((previous) => mergeProvisionedManagedUser(previous, provisionedPayload))

    return {
      ...result.user,
      lastAccessAt: result.user.lastAccessAt ? new Date(result.user.lastAccessAt) : undefined,
    }
  }

  const updateManagedUser = async (
    userId: string,
    payload: Omit<CreateManagedUserPayload, "password">,
  ) => {
    const currentUserRecord = state.users.find((user) => user.id === userId)
    if (!currentUserRecord) {
      throw new Error("User não encontrado.")
    }

    const response = await fetch("/api/auth/provision-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        name: payload.name,
        email: payload.email,
        title: payload.title,
        phone: payload.phone,
        platformRole: payload.platformRole,
        status: payload.status,
        password: "__preserve_existing_password__",
        memberships: payload.memberships,
        entities: state.entities.map((entity) => ({
          ...entity,
          createdAt: entity.createdAt.toISOString(),
        })),
      }),
    })

    const result = (await response.json()) as
      | ({ ok: true } & ProvisionedManagedUserPayload)
      | { error?: string }

    if (!response.ok || !("ok" in result)) {
      throw new Error(result.error || "Não foi possível atualizar o user.")
    }

    const nextUser: ManagedUser = {
      ...currentUserRecord,
      name: payload.name,
      email: payload.email.trim().toLowerCase(),
      title: payload.title,
      phone: payload.phone,
      platformRole: payload.platformRole,
      status: payload.status,
      lastAccessAt: result.user?.lastAccessAt ? new Date(result.user.lastAccessAt) : currentUserRecord.lastAccessAt,
    }

    const normalizedMemberships = payload.memberships.map((membership, index) => ({
      id:
        state.memberships.find(
          (item) => item.userId === userId && item.entityId === membership.entityId,
        )?.id || createId("membership"),
      userId,
      entityId: membership.entityId,
      role: membership.role,
      isDefault: membership.isDefault ?? index === 0,
    }))

    commit((previous) => ({
      ...previous,
      users: previous.users.map((user) => (user.id === userId ? nextUser : user)),
      memberships: [
        ...previous.memberships.filter((membership) => membership.userId !== userId),
        ...normalizedMemberships,
      ],
    }))

    return nextUser
  }

  const deleteManagedUser = async (userId: string) => {
    const targetUser = state.users.find((user) => user.id === userId)
    if (!targetUser) return
    if (state.currentUserId === userId) return

    await fetch("/api/auth/provision-user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        email: targetUser.email,
      }),
    })

    commit((previous) => ({
      ...previous,
      users: previous.users.filter((user) => user.id !== userId),
      memberships: previous.memberships.filter((membership) => membership.userId !== userId),
    }))
  }

  const provisionManagedUserAccess = async (userId: string, password: string) => {
    const user = state.users.find((item) => item.id === userId)

    if (!user) {
      throw new Error("User não encontrado.")
    }

    const memberships = state.memberships
      .filter((membership) => membership.userId === userId)
      .map((membership) => ({
        entityId: membership.entityId,
        role: membership.role,
        isDefault: membership.isDefault,
      }))

    const response = await fetch("/api/auth/provision-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        name: user.name,
        email: user.email,
        title: user.title,
        phone: user.phone,
        platformRole: user.platformRole,
        status: user.status,
        password,
        memberships,
        entities: state.entities.map((entity) => ({
          ...entity,
          createdAt: entity.createdAt.toISOString(),
        })),
      }),
    })

    const result = (await response.json()) as
      | ({ ok: true } & ProvisionedManagedUserPayload)
      | { error?: string }

    if (!response.ok || !("ok" in result)) {
      throw new Error(result.error || "Não foi possível definir a password do user.")
    }

    commit((previous) =>
      mergeProvisionedManagedUser(previous, {
        user: result.user,
        entities: result.entities,
        memberships: result.memberships,
      }),
    )
  }

  const setActiveEntity = (entityId: string) => {
    commit((previous) => {
      const currentUser = previous.users.find((user) => user.id === previous.currentUserId)
      const canAccessEntity =
        currentUser?.platformRole === "super_admin" ||
        previous.memberships.some((membership) => membership.userId === previous.currentUserId && membership.entityId === entityId)

      if (!canAccessEntity) return previous

      return {
        ...previous,
        activeEntityId: entityId,
      }
    })
  }

  const signInAsManagedUser = async (email: string, password: string, remember = false) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        remember,
      }),
    })

    if (!response.ok) {
      return null
    }

    const normalizedEmail = email.trim().toLowerCase()
    let user = state.users.find((item) => item.email.toLowerCase() === normalizedEmail)

    if (!user) {
      const meResponse = await fetch("/api/auth/me", {
        cache: "no-store",
      })

      if (meResponse.ok) {
        const mePayload = (await meResponse.json()) as ProvisionedManagedUserPayload & {
          authenticated?: boolean
        }

        if (mePayload.user) {
          const hydratedState = mergeProvisionedManagedUser(state, {
            user: mePayload.user,
            entities: mePayload.entities || [],
            memberships: mePayload.memberships || [],
          })

          user = hydratedState.users.find(
            (item) => item.email.toLowerCase() === normalizedEmail,
          )
          commit(hydratedState)
        }
      }
    }

    if (!user) {
      return null
    }

    commit((previous) => applyAuthenticatedSession(previous, normalizedEmail))

    return user
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } finally {
      commit((previous) => applyAuthenticatedSession(previous, null))
    }
  }

  const assignEntityToUser = (userId: string, entityId: string, role: EntityRole) => {
    commit((previous) => {
      const alreadyAssigned = previous.memberships.some(
        (membership) => membership.userId === userId && membership.entityId === entityId,
      )
      if (alreadyAssigned) return previous

      const userMemberships = previous.memberships.filter((membership) => membership.userId === userId)

      return {
        ...previous,
        memberships: [
          ...previous.memberships,
          {
            id: createId("membership"),
            userId,
            entityId,
            role,
            isDefault: userMemberships.length === 0,
          },
        ],
      }
    })
  }

  const updateMembershipRole = (membershipId: string, role: EntityRole) => {
    commit((previous) => ({
      ...previous,
      memberships: previous.memberships.map((membership) =>
        membership.id === membershipId ? { ...membership, role } : membership,
      ),
    }))
  }

  const setDefaultEntityForUser = (userId: string, entityId: string) => {
    commit((previous) => ({
      ...previous,
      memberships: previous.memberships.map((membership) =>
        membership.userId === userId
          ? { ...membership, isDefault: membership.entityId === entityId }
          : membership,
      ),
      activeEntityId:
        previous.currentUserId === userId && previous.memberships.some((membership) => membership.entityId === entityId)
          ? entityId
          : previous.activeEntityId,
    }))
  }

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === state.currentUserId) || null,
    [state.currentUserId, state.users],
  )

  const isSuperAdmin = currentUser?.platformRole === "super_admin"

  const currentUserMemberships = useMemo(
    () => state.memberships.filter((membership) => membership.userId === state.currentUserId),
    [state.currentUserId, state.memberships],
  )

  const currentUserEntities = useMemo(() => {
    if (isSuperAdmin) return state.entities
    const entityIds = new Set(currentUserMemberships.map((membership) => membership.entityId))
    return state.entities.filter((entity) => entityIds.has(entity.id))
  }, [currentUserMemberships, isSuperAdmin, state.entities])

  const activeEntity = useMemo(
    () => state.entities.find((entity) => entity.id === state.activeEntityId) || currentUserEntities[0] || null,
    [currentUserEntities, state.activeEntityId, state.entities],
  )

  const value: AccessManagementContextValue = {
    state,
    isReady,
    currentUser,
    activeEntity,
    isSuperAdmin,
    currentUserEntities,
    currentUserMemberships,
    createEntity,
    updateEntity,
    deleteEntity,
    createManagedUser,
    updateManagedUser,
    deleteManagedUser,
    provisionManagedUserAccess,
    setActiveEntity,
    signInAsManagedUser,
    signOut,
    assignEntityToUser,
    updateMembershipRole,
    setDefaultEntityForUser,
    getMembershipsForUser: (userId: string) => state.memberships.filter((membership) => membership.userId === userId),
    getEntitiesForUser: (userId: string) => {
      const entityIds = new Set(
        state.memberships
          .filter((membership) => membership.userId === userId)
          .map((membership) => membership.entityId),
      )
      return state.entities.filter((entity) => entityIds.has(entity.id))
    },
  }

  return (
    <AccessManagementContext.Provider value={value}>
      {children}
    </AccessManagementContext.Provider>
  )
}

export function useAccessManagement() {
  const context = useContext(AccessManagementContext)

  if (!context) {
    throw new Error("useAccessManagement must be used within AccessManagementProvider")
  }

  return context
}
