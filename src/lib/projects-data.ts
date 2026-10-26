/**
 * Formato dos projetos (More Invest, CACO, C360, Outros) salvos pela área de admin.
 * Usado pelo site (src/) e pelas funções do servidor (api/) — por isso só importa tipos.
 */
import type { ExternalLinkItem, GalleryItem, MediaImage, ProjectInput, SectionId } from '../content/types'

export const SECTION_IDS: SectionId[] = ['more-invest', 'caco', 'c360', 'outros']

export interface StoredProject extends ProjectInput {
  section: SectionId
}

/** A ordem de `projects` é a ordem em que aparecem em cada aba. */
export interface ProjectsData {
  projects: StoredProject[]
}

const isStr = (v: unknown, max: number): v is string => typeof v === 'string' && v.length <= max
const optStr = (v: unknown, max: number) => v === undefined || isStr(v, max)
const isSlug = (v: unknown): v is string => isStr(v, 80) && /^[a-z0-9-]+$/.test(v)
const isUrl = (v: unknown): v is string => isStr(v, 1000) && (v.startsWith('/') || v.startsWith('https://'))
const isPos = (v: unknown) => v === undefined || (typeof v === 'number' && Number.isFinite(v) && v > 0 && v < 100_000)
const strList = (v: unknown, items: number, max: number) => v === undefined || (Array.isArray(v) && v.length <= items && v.every((s) => isStr(s, max)))

function validImage(img: MediaImage | undefined) {
  if (img === undefined) return true
  return isUrl(img.src) && (img.thumb === undefined || isUrl(img.thumb)) && isStr(img.alt, 300) && isPos(img.width) && isPos(img.height) && optStr(img.caption, 500)
}

function validGalleryItem(g: GalleryItem) {
  if (g && typeof g === 'object' && 'kind' in g && g.kind === 'video') {
    return ['youtube', 'vimeo'].includes(g.provider) && isStr(g.source, 40) && /^[\w-]+$/.test(g.source) && isStr(g.title, 200) && optStr(g.caption, 500)
  }
  return validImage(g as MediaImage)
}

const validLink = (l: ExternalLinkItem) => isStr(l?.label, 80) && l.label.trim() !== '' && isStr(l.url, 1000) && /^https?:\/\//.test(l.url)

/** Confere a estrutura antes de salvar. Devolve a mensagem de erro, ou null se estiver tudo certo. */
export function validateProjects(data: unknown): string | null {
  const projects = (data as ProjectsData | null)?.projects
  if (!Array.isArray(projects)) return 'Dados inválidos.'
  if (projects.length > 500) return 'Projetos demais.'
  const seen = new Set<string>()
  for (const p of projects) {
    const name = typeof p?.title === 'string' ? `"${p.title}"` : 'sem título'
    if (!SECTION_IDS.includes(p?.section)) return `Projeto ${name}: aba inválida.`
    if (!isSlug(p.slug)) return `Projeto ${name}: endereço inválido.`
    if (seen.has(`${p.section}/${p.slug}`)) return `Há dois projetos com o mesmo endereço (${p.slug}).`
    seen.add(`${p.section}/${p.slug}`)
    if (!isStr(p.title, 200) || !p.title.trim()) return 'Todo projeto precisa de um título.'
    if (!isSlug(p.category)) return `Projeto ${name}: categoria inválida.`
    if (!isStr(p.summary, 1000) || !p.summary.trim()) return `Projeto ${name}: escreva um resumo.`
    for (const k of ['year', 'area', 'role'] as const) if (!optStr(p[k], 200)) return `Projeto ${name}: texto longo demais.`
    for (const k of ['context', 'objective', 'challenge', 'strategy', 'process'] as const) if (!optStr(p[k], 10_000)) return `Projeto ${name}: texto longo demais.`
    if (p.result !== undefined && (!isStr(p.result?.text, 2000) || !optStr(p.result.source, 300))) return `Projeto ${name}: resultado inválido.`
    if (!strList(p.responsibilities, 30, 300) || !strList(p.tools, 30, 80) || !strList(p.deliverables, 30, 120) || !strList(p.tags, 30, 60))
      return `Projeto ${name}: lista longa demais.`
    if (p.featured !== undefined && typeof p.featured !== 'boolean') return 'Dados inválidos.'
    if (p.featuredOrder !== undefined && typeof p.featuredOrder !== 'number') return 'Dados inválidos.'
    if (!validImage(p.cover)) return `Projeto ${name}: capa inválida.`
    if (p.gallery !== undefined && (!Array.isArray(p.gallery) || p.gallery.length > 80 || !p.gallery.every(validGalleryItem)))
      return `Projeto ${name}: imagens ou vídeos inválidos.`
    if (p.links !== undefined && (!Array.isArray(p.links) || p.links.length > 10 || !p.links.every(validLink))) return `Projeto ${name}: link inválido.`
    if (p.collaborators !== undefined || p.placeholder !== undefined) return 'Dados inválidos.'
  }
  return null
}

/** Todos os arquivos enviados que um projeto usa (capa e imagens). */
export function projectFiles(p: StoredProject): string[] {
  const imgs = [p.cover, ...(p.gallery ?? []).filter((g): g is MediaImage => !('kind' in g))].filter(Boolean) as MediaImage[]
  return imgs.flatMap((i) => [i.src, i.thumb].filter((u): u is string => Boolean(u)))
}
