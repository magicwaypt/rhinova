import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  createSessionToken,
  getSessionMaxAge,
  normalizeEmail,
  SESSION_COOKIE_NAME,
  validateSuperAdminCredentials,
} from "@/lib/auth"
import { verifyProvisionedUserCredentials } from "@/lib/provisioned-users"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string
      password?: string
      remember?: boolean
    }

    const email = normalizeEmail(body.email || "")
    const password = body.password || ""
    const remember = Boolean(body.remember)

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password são obrigatórios." },
        { status: 400 },
      )
    }

    const isSuperAdmin = validateSuperAdminCredentials(email, password)
    const provisionedUser = isSuperAdmin
      ? null
      : await verifyProvisionedUserCredentials(email, password)

    if (!isSuperAdmin && !provisionedUser) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 },
      )
    }

    const maxAge = getSessionMaxAge(remember)
    const token = createSessionToken(email, maxAge)
    const cookieStore = await cookies()

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    })

    return NextResponse.json({ ok: true, email })
  } catch {
    return NextResponse.json(
      { error: "Não foi possível iniciar sessão." },
      { status: 500 },
    )
  }
}
