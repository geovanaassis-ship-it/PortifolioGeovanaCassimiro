import { useMemo, useState } from 'react'
import { site } from '../../content/site'
import type { Category, Project } from '../../content/types'
import { usedCategories } from '../../lib/content'
import { FilterBar } from '../ui/FilterBar'
import { EmptyState } from '../ui/bits'
import { ProjectCard } from './ProjectCard'

interface Props {
  /** null enquanto os projetos carregam. */
  projects: Project[] | null
  categories: Category[]
  label: string
  emptyTitle?: string
}

/** Grade de projetos com filtro por categoria (aparece só quando há projetos suficientes). */
export function ProjectList({ projects, categories, label, emptyTitle = 'Projetos em curadoria' }: Props) {
  const [filter, setFilter] = useState('all')
  const list = useMemo(() => projects ?? [], [projects])
  const cats = useMemo(() => usedCategories(categories, list), [categories, list])
  const counts = useMemo(
    () => list.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }), {}),
    [list],
  )
  const showFilters = list.length >= site.minProjectsForFilters && cats.length > 1
  const shown = filter === 'all' ? list : list.filter((p) => p.category === filter)

  if (!projects) return <p className="label-mono py-10 text-center text-ink/55">Carregando projetos…</p>
  if (!list.length) {
    return <EmptyState title={emptyTitle}>Os trabalhos desta seção estão sendo selecionados e chegam em breve.</EmptyState>
  }

  return (
    <div>
      {showFilters && (
        <div className="mb-8">
          <FilterBar categories={cats} value={filter} onChange={setFilter} label={`Filtrar ${label} por categoria`} counts={counts} />
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'projeto' : 'projetos'}
      </p>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <li key={p.path}>
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}
