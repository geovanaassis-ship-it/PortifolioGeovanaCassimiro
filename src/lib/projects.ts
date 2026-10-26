import { useEffect, useState } from 'react'
import { sections } from '../content/site'
import type { Project } from '../content/types'
import type { ProjectsData, StoredProject } from './projects-data'

/** Um projeto ganha página própria quando tem conteúdo além do resumo. */
function hasDetail(p: StoredProject) {
  return Boolean(
    p.context || p.objective || p.challenge || p.strategy || p.process || p.result ||
      p.responsibilities?.length || (p.gallery?.length ?? 0) > 0,
  )
}

export const toProjects = (stored: StoredProject[]): Project[] =>
  stored.map((p) => ({ ...p, path: `${sections[p.section].path}/${p.slug}`, hasDetail: hasDetail(p) }))

/** Dados salvos pelo admin (/api/projects). Sem servidor ou sem nada salvo: lista vazia. */
export async function loadProjectsData(): Promise<ProjectsData> {
  try {
    const res = await fetch('/api/projects', { cache: 'no-store' })
    if (res.ok && res.headers.get('content-type')?.includes('json')) {
      const { data } = (await res.json()) as { data: ProjectsData | null }
      if (data) return data
    }
  } catch {
    /* sem servidor */
  }
  return { projects: [] }
}

// Carregado uma vez por visita e compartilhado entre as páginas.
let cache: Promise<Project[]> | null = null
let loaded: Project[] | null = null

export function useProjects(): Project[] | null {
  const [projects, setProjects] = useState<Project[] | null>(loaded)
  useEffect(() => {
    cache ??= loadProjectsData().then((d) => (loaded = toProjects(d.projects)))
    let alive = true
    cache.then((p) => alive && setProjects(p))
    return () => {
      alive = false
    }
  }, [])
  return projects
}
