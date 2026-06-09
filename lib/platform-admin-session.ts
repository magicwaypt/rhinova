import { cookies } from "next/headers"
import { isSuperAdminEmail, SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"
import { findProvisionedUserByEmail } from "@/lib/provisioned-users"

export async function requirePlatformAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const session = verifySessionToken(token)

  if (!session) {
    return { ok: false as const, status: 401 }
  }

  const record = await findProvisionedUserByEmail(session.email)
  const isAuthorized =
    isSuperAdminEmail(session.email) ||
    record?.user.platformRole === "super_admin"

  if (!isAuthorized) {
    return { ok: false as const, status: 403 }
  }

  return {
    ok: true as const,
    session,
    record,
  }
}
