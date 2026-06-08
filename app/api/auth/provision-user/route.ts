import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { isSuperAdminEmail, SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"
import { deleteProvisionedUser, findProvisionedUserByEmail, upsertProvisionedUser } from "@/lib/provisioned-users"

interface ProvisionUserRequestBody {
  userId?: string
  name?: string
  email?: string
  title?: string
  phone?: string
  platformRole?: "super_admin" | "user"
  status?: "active" | "invited" | "inactive"
  password?: string
  entities?: Array<{
    id: string
    name: string
    legalName: string
    nif: string
    industry: string
    employeeCount: number
    status: "active" | "setup" | "paused"
    headquarters: string
    createdAt: string
  }>
  memberships?: Array<{
    entityId: string
    role: "owner" | "manager" | "analyst" | "viewer"
    isDefault?: boolean
  }>
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const session = verifySessionToken(token)
  const provisionedActor = session ? await findProvisionedUserByEmail(session.email) : null
  const isAuthorized =
    Boolean(session) &&
    (isSuperAdminEmail(session!.email) || provisionedActor?.user.platformRole === "super_admin")

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Sem permissão para provisionar utilizadores." },
      { status: 403 },
    )
  }

  try {
    const body = (await request.json()) as ProvisionUserRequestBody

    if (!body.name || !body.email || !body.title || !body.platformRole || !body.status) {
      return NextResponse.json(
        { error: "Dados obrigatórios em falta para criar o utilizador." },
        { status: 400 },
      )
    }

    const existingRecord = await findProvisionedUserByEmail(body.email)
    const shouldPreservePassword = body.password === "__preserve_existing_password__"

    if (body.password && !shouldPreservePassword && body.password.length < 8) {
      return NextResponse.json(
        { error: "A password tem de ter pelo menos 8 caracteres." },
        { status: 400 },
      )
    }

    if ((!body.password || body.password.length === 0) && !shouldPreservePassword && !existingRecord) {
      return NextResponse.json(
        { error: "A password tem de ter pelo menos 8 caracteres." },
        { status: 400 },
      )
    }

    const entities = body.platformRole === "super_admin"
      ? body.entities || []
      : (body.entities || []).filter((entity) =>
          (body.memberships || []).some((membership) => membership.entityId === entity.id),
        )

    if (shouldPreservePassword && !existingRecord) {
      return NextResponse.json({
        ok: true,
        user: {
          id: body.userId || "",
          name: body.name,
          email: body.email,
          title: body.title,
          platformRole: body.platformRole,
          status: body.status,
          phone: body.phone,
        },
        entities,
        memberships: (body.platformRole === "super_admin" ? [] : body.memberships || []).map((membership, index) => ({
          id: `${body.userId || "membership"}-${membership.entityId}-${index}`,
          userId: body.userId || "",
          entityId: membership.entityId,
          role: membership.role,
          isDefault: membership.isDefault ?? index === 0,
        })),
      })
    }

    const record = await upsertProvisionedUser({
      user: {
        id: body.userId,
        name: body.name,
        email: body.email,
        title: body.title,
        platformRole: body.platformRole,
        status: body.status,
        phone: body.phone,
      },
      password: shouldPreservePassword ? undefined : body.password,
      entities,
      memberships: body.platformRole === "super_admin" ? [] : body.memberships || [],
    })

    return NextResponse.json({
      ok: true,
      user: record.user,
      entities: record.entities,
      memberships: record.memberships,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível provisionar o utilizador."

    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const session = verifySessionToken(token)
  const provisionedActor = session ? await findProvisionedUserByEmail(session.email) : null
  const isAuthorized =
    Boolean(session) &&
    (isSuperAdminEmail(session!.email) || provisionedActor?.user.platformRole === "super_admin")

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Sem permissão para remover utilizadores." },
      { status: 403 },
    )
  }

  const body = (await request.json()) as { userId?: string; email?: string }

  if (!body.userId) {
    return NextResponse.json(
      { error: "É necessário indicar o user a remover." },
      { status: 400 },
    )
  }

  await deleteProvisionedUser(body.userId, body.email)

  return NextResponse.json({ ok: true })
}
