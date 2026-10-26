import { isAuthed, unauthorized } from './_lib/auth.js'
import { deleteFiles, readGallery, writeGallery } from './_lib/store.js'
import { validateGallery, type Gallery } from '../src/lib/gallery-types.js'

/** GET: dados da galeria (null se nada foi salvo ainda) · PUT: salva a galeria inteira (admin). */
export async function GET() {
  try {
    return Response.json({ gallery: await readGallery() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthed(request)) return unauthorized()
  const next = (await request.json().catch(() => null)) as Gallery | null
  const error = validateGallery(next)
  if (error) return Response.json({ error }, { status: 400 })

  const previous = await readGallery()
  await writeGallery(next!)

  // Apaga do armazenamento as fotos que saíram da galeria.
  const kept = new Set(next!.photos.flatMap((p) => [p.src, p.thumb]))
  const removed = (previous?.photos ?? []).flatMap((p) => [p.src, p.thumb]).filter((u) => !kept.has(u))
  await deleteFiles(removed).catch((err) => console.error('Falha ao apagar fotos removidas:', err))

  return Response.json({ gallery: next })
}
