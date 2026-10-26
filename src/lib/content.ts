import { photoCategories, photoSeries } from '../content/photography'
import { sections, site } from '../content/site'
import type { Category, Project, SectionId } from '../content/types'

const isVisible = (item: { placeholder?: boolean }) => site.showPlaceholders || !item.placeholder

/* Os projetos vêm da área de admin (ver lib/projects.ts → useProjects). */

export const projectsBySection = (projects: Project[], section: SectionId) => projects.filter((p) => p.section === section)

export const featuredProjects = (projects: Project[]) =>
  projects.filter((p) => p.featured).sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))

export const findProjectByPath = (projects: Project[], path: string) => projects.find((p) => p.path === path.replace(/\/$/, ''))

/** Categorias da seção que realmente têm projetos, na ordem definida em site.ts. */
export function usedCategories(categories: Category[], items: { category: string }[]) {
  const used = new Set(items.map((i) => i.category))
  return categories.filter((c) => used.has(c.id))
}

export const categoryLabel = (section: SectionId, id: string) =>
  sections[section].categories.find((c) => c.id === id)?.label ?? id

export const visibleSeries = photoSeries.filter(isVisible)
export const photoCategoryLabel = (id: string) => photoCategories.find((c) => c.id === id)?.label ?? id

/** Projeto anterior e seguinte dentro da mesma seção (para navegação na página do projeto). */
export function siblings(projects: Project[], project: Project) {
  const list = projects.filter((p) => p.section === project.section && p.hasDetail)
  const i = list.findIndex((p) => p.path === project.path)
  return { prev: i > 0 ? list[i - 1] : undefined, next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined }
}

/** Aviso no console (só em desenvolvimento) para categorias de fotografia inválidas. */
if (import.meta.env.DEV) {
  for (const s of photoSeries)
    if (!photoCategories.some((c) => c.id === s.category))
      console.warn(`[conteúdo] Categoria de fotografia "${s.category}" não existe (ensaio "${s.title}").`)
}
