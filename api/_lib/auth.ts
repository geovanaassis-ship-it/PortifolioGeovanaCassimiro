import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Login da área de admin: uma senha só (variável ADMIN_PASSWORD na Vercel).
 * A sessão é um cookie HttpOnly assinado com HMAC, válido por 7 dias.
 * Trocar a senha (ou ADMIN_SESSION_SECRET) desconecta todas as sessões abertas.
 */
const COOKIE = 'admin_session'
const MAX_AGE = 60 * 60 * 24 * 7

const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

const sameText = (a: string, b: string) => {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export const isConfigured = () => Boolean(process.env.ADMIN_PASSWORD)

export const checkPassword = (password: string) => isConfigured() && sameText(password, process.env.ADMIN_PASSWORD!)

export function sessionCookie() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE)
  return `${COOKIE}=${exp}.${sign(exp)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`
}

export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`

export function isAuthed(request: Request) {
  if (!isConfigured()) return false
  const token = request.headers
    .get('cookie')
    ?.split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1)
  if (!token) return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false
  return sameText(sig, sign(exp))
}

export const unauthorized = () => Response.json({ error: 'Faça login de novo.' }, { status: 401 })
