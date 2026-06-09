import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { isSuperAdminEmail, SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"
import { findProvisionedUserByEmail } from "@/lib/provisioned-users"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const session = verifySessionToken(token)

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const record = await findProvisionedUserByEmail(session.email)

  if (!record) {
    if (isSuperAdminEmail(session.email)) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: "user-super-admin",
          name: "Rhinova Super Admin",
          email: session.email,
          title: "Platform Super Admin",
          platformRole: "super_admin",
          status: "active",
          phone: "+351 910 000 001",
          lastAccessAt: new Date().toISOString(),
        },
        entities: [],
        memberships: [],
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: null,
    })
  }

  return NextResponse.json({
    authenticated: true,
    user: record.user,
    entities: record.entities,
    memberships: record.memberships,
  })
}
