import { randomUUID } from 'node:crypto'
import { isAuthed, unauthorized } from './_lib/auth.js'
import { saveFile } from './_lib/store.js'

/**
 * POST (admin): recebe uma imagem já reduzida pelo navegador — campos "full" e "thumb"
 * (webp ou jpeg), "group" ("galeria" ou "projetos") e "niche" (subpasta: nicho ou aba) —
 * e devolve os endereços salvos. A imagem só passa a valer depois que o admin salva os
 * dados (PUT /api/gallery ou /api/projects).
 */
const MAX_BYTES = 4 * 1024 * 1024
const TYPES = new Set(['image/webp', 'image/jpeg'])

export async function POST(request: Request) {
  if (!isAuthed(request)) return unauthorized()
  const form = await request.formData().catch(() => null)
  const full = form?.get('full')
  const thumb = form?.get('thumb')
  const niche = String(form?.get('niche') ?? '')
  const group = String(form?.get('group') ?? 'galeria')
  if (!(full instanceof Blob) || !(thumb instanceof Blob) || !/^[a-z0-9-]{1,80}$/.test(niche) || !['galeria', 'projetos'].includes(group)) {
    return Response.json({ error: 'Envio incompleto.' }, { status: 400 })
  }
  for (const f of [full, thumb]) {
    if (!TYPES.has(f.type)) return Response.json({ error: 'Formato de imagem não aceito.' }, { status: 400 })
    if (f.size > MAX_BYTES) return Response.json({ error: 'Imagem grande demais depois de reduzida.' }, { status: 413 })
  }
  const id = randomUUID().slice(0, 8)
  const ext = full.type === 'image/webp' ? 'webp' : 'jpg'
  const [src, thumbUrl] = await Promise.all([
    saveFile(`${group}/fotos/${niche}/${id}.${ext}`, full, full.type),
    saveFile(`${group}/fotos/${niche}/${id}-thumb.${ext}`, thumb, thumb.type),
  ])
  return Response.json({ id, src, thumb: thumbUrl })
}
