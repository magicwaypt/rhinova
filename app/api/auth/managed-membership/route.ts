import { NextResponse } from "next/server"
import { requirePlatformAdminSession } from "@/lib/platform-admin-session"
import {
  setManagedUserDefaultEntity,
  updateManagedMembershipRole,
} from "@/lib/provisioned-users"

interface ManagedMembershipRequestBody {
  membershipId?: string
  role?: "owner" | "manager" | "analyst" | "viewer"
  userId?: string
  entityId?: string
  action?: "set-default"
}

export async function PATCH(request: Request) {
  const auth = await requirePlatformAdminSession()

  if (!auth.ok) {
    return NextResponse.json(
      { error: "Sem permissão para atualizar memberships." },
      { status: auth.status },
    )
  }

  try {
    const body = (await request.json()) as ManagedMembershipRequestBody

    if (body.action === "set-default") {
      if (!body.userId || !body.entityId) {
        return NextResponse.json(
          { error: "É necessário indicar user e entidade por defeito." },
          { status: 400 },
        )
      }

      await setManagedUserDefaultEntity(body.userId, body.entityId)

      return NextResponse.json({ ok: true })
    }

    if (!body.membershipId || !body.role) {
      return NextResponse.json(
        { error: "É necessário indicar membership e role." },
        { status: 400 },
      )
    }

    await updateManagedMembershipRole(body.membershipId, body.role)

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível atualizar a membership."

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
