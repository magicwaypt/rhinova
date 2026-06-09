import { NextResponse } from "next/server"
import { requirePlatformAdminSession } from "@/lib/platform-admin-session"
import { listAccessManagementState } from "@/lib/provisioned-users"

export async function GET() {
  const auth = await requirePlatformAdminSession()

  if (!auth.ok) {
    return NextResponse.json(
      { error: "Sem permissão para consultar a administração da plataforma." },
      { status: auth.status },
    )
  }

  const snapshot = await listAccessManagementState()

  return NextResponse.json({
    ok: true,
    users: snapshot.users,
    entities: snapshot.entities,
    memberships: snapshot.memberships,
  })
}
