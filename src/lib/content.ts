import { allProjects } from '../content/projects'
import { photoCategories, photoSeries } from '../content/photography'
import { sections, site } from '../content/site'
import type { Category, Project, SectionId } from '../content/types'

const isVisible = (item: { placeholder?: boolean }) => site.showPlaceholders || !item.placeholder

export const visibleProjects = allProjects.filter(isVisible)

export const projectsBySection = (section: SectionId) => visibleProjects.filter((p) => p.section === section)

export const featuredProjects = () =>
  visibleProjects
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))

export const findProjectByPath = (path: string) => visibleProjects.find((p) => p.path === path.replace(/\/$/, ''))

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
export function siblings(project: Project) {
  const list = visibleProjects.filter((p) => p.section === project.section && p.hasDetail)
  const i = list.findIndex((p) => p.path === project.path)
  return { prev: i > 0 ? list[i - 1] : undefined, next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined }
}

/** Aviso no console (só em desenvolvimento) para categorias ou slugs inválidos. */
if (import.meta.env.DEV) {
  const paths = new Set<string>()
  for (const p of allProjects) {
    if (paths.has(p.path)) console.warn(`[conteúdo] Slug repetido: ${p.path}`)
    paths.add(p.path)
    if (!/^[a-z0-9-]+$/.test(p.slug)) console.warn(`[conteúdo] Slug inválido em "${p.title}": use letras minúsculas, números e hífens.`)
    if (!sections[p.section].categories.some((c) => c.id === p.category))
      console.warn(`[conteúdo] Categoria "${p.category}" não existe na seção ${p.section} (projeto "${p.title}").`)
  }
  for (const s of photoSeries)
    if (!photoCategories.some((c) => c.id === s.category))
      console.warn(`[conteúdo] Categoria de fotografia "${s.category}" não existe (ensaio "${s.title}").`)
}
