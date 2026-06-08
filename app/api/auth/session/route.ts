import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const session = verifySessionToken(token)

  if (!session) {
    return NextResponse.json({ authenticated: false })
  }

  return NextResponse.json({
    authenticated: true,
    email: session.email,
  })
}
