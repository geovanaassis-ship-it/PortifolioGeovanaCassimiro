import { isAuthed, unauthorized } from './_lib/auth.js'
import { deleteFiles, readData, writeData } from './_lib/store.js'
import { projectFiles, validateProjects, type ProjectsData } from '../src/lib/projects-data.js'

/** GET: projetos de todas as abas (null se nada foi salvo ainda) · PUT: salva a lista inteira (admin). */
export async function GET() {
  try {
    return Response.json({ data: await readData<ProjectsData>('projetos') }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthed(request)) return unauthorized()
  const next = (await request.json().catch(() => null)) as ProjectsData | null
  const error = validateProjects(next)
  if (error) return Response.json({ error }, { status: 400 })

  const previous = await readData<ProjectsData>('projetos')
  await writeData('projetos', next)

  // Apaga do armazenamento as imagens que saíram dos projetos.
  const kept = new Set(next!.projects.flatMap(projectFiles))
  const removed = (previous?.projects ?? []).flatMap(projectFiles).filter((u) => !kept.has(u))
  await deleteFiles(removed).catch((err) => console.error('Falha ao apagar imagens removidas:', err))

  return Response.json({ data: next })
}
