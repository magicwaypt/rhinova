import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth"

export async function POST(request: Request) {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, "", getSessionCookieOptions(0, request))

  return NextResponse.json({ ok: true })
}
