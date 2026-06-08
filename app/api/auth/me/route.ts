import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"
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
