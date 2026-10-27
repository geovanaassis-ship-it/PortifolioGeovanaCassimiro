import { checkPassword, clearCookie, isAuthed, isConfigured, sessionCookie } from './_lib/auth.js'

/** GET: está logada? · POST { password }: entra · DELETE: sai. */
export function GET(request: Request) {
  return Response.json({ authed: isAuthed(request), configured: isConfigured() }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return Response.json({ error: 'A senha de admin ainda não foi configurada (ADMIN_PASSWORD na Vercel).' }, { status: 503 })
  }
  const { password } = (await request.json().catch(() => ({}))) as { password?: unknown }
  if (typeof password !== 'string' || !checkPassword(password)) {
    // Atraso para dificultar tentativas em sequência.
    await new Promise((r) => setTimeout(r, 800))
    return Response.json({ error: 'Senha incorreta.' }, { status: 401 })
  }
  return Response.json({ authed: true }, { headers: { 'Set-Cookie': sessionCookie() } })
}

export function DELETE() {
  return Response.json({ authed: false }, { headers: { 'Set-Cookie': clearCookie() } })
}
