import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

export const SESSION_COOKIE_NAME = "rhinova_session"

const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 12
const REMEMBER_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30

interface SessionPayload {
  email: string
  iat: number
  exp: number
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url")
}

function fromBase64Url<T>(value: string) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T
}

function getAuthSecret() {
  return (
    process.env.RHINOVA_AUTH_SECRET ||
    "rhinova-dev-insecure-fallback-secret-change-me"
  )
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret())
    .update(value)
    .digest("base64url")
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "utf8")
  const rightBuffer = Buffer.from(right, "utf8")

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function getSuperAdminCredentials() {
  const email = process.env.RHINOVA_SUPER_ADMIN_EMAIL
  const password = process.env.RHINOVA_SUPER_ADMIN_PASSWORD

  if (!email || !password) {
    return null
  }

  return {
    email: normalizeEmail(email),
    password,
  }
}

export function isSuperAdminEmail(email: string) {
  const credentials = getSuperAdminCredentials()

  if (!credentials) {
    return false
  }

  return normalizeEmail(email) === credentials.email
}

export function validateSuperAdminCredentials(email: string, password: string) {
  const credentials = getSuperAdminCredentials()

  if (!credentials) {
    return false
  }

  return (
    safeEqual(normalizeEmail(email), credentials.email) &&
    safeEqual(password, credentials.password)
  )
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex")

  return {
    salt,
    hash,
  }
}

export function verifyPassword(password: string, salt: string, expectedHash: string) {
  const candidateHash = scryptSync(password, salt, 64).toString("hex")

  return safeEqual(candidateHash, expectedHash)
}

export function getSessionMaxAge(remember: boolean) {
  return remember ? REMEMBER_SESSION_TTL_SECONDS : DEFAULT_SESSION_TTL_SECONDS
}

// The app preview runs inside a cross-origin iframe, so the session cookie must
// use SameSite=None + Secure to be accepted and sent back on subsequent
// requests. Without this, the cookie is silently dropped and /api/auth/me
// returns 401 right after a successful login.
export function getSessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "none" as const,
    secure: true,
    path: "/",
    maxAge,
  }
}

export function createSessionToken(email: string, maxAgeSeconds: number) {
  const now = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = {
    email: normalizeEmail(email),
    iat: now,
    exp: now + maxAgeSeconds,
  }
  const encodedPayload = toBase64Url(JSON.stringify(payload))
  const signature = sign(encodedPayload)

  return `${encodedPayload}.${signature}`
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return null

  const [encodedPayload, signature] = token.split(".")

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = sign(encodedPayload)
  if (!safeEqual(signature, expectedSignature)) {
    return null
  }

  try {
    const payload = fromBase64Url<SessionPayload>(encodedPayload)
    const now = Math.floor(Date.now() / 1000)

    if (!payload.email || payload.exp <= now) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
