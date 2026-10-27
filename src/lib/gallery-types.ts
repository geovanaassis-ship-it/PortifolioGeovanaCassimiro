/**
 * Formato dos dados da galeria de fotografia.
 * Usado pelo site (src/) e pelas funções do servidor (api/).
 */

/** Nicho (filtro) da galeria, ex.: "Hamburgada do Bem", "Fotografia publicitária". */
export interface GalleryNiche {
  /** Identificador: minúsculas, números e hífens. */
  id: string
  label: string
  description?: string
}

export interface GalleryPhoto {
  id: string
  /** Versão grande (lado maior de até 2000 px), aberta ao ampliar. */
  src: string
  /** Miniatura (lado maior de até 900 px), usada na grade. */
  thumb: string
  width: number
  height: number
  /** ID de um nicho. */
  niche: string
  /** Nome exibido ao passar o mouse (opcional). */
  title?: string
  /** Data em que a foto foi tirada, no formato AAAA-MM-DD (opcional). */
  date?: string
}

/** A ordem de `photos` é a ordem em que aparecem no site. */
export interface Gallery {
  niches: GalleryNiche[]
  photos: GalleryPhoto[]
}

const isStr = (v: unknown, max = 500): v is string => typeof v === 'string' && v.length <= max
const isId = (v: unknown): v is string => isStr(v, 80) && /^[a-z0-9-]+$/.test(v)
const isUrl = (v: unknown): v is string => isStr(v, 1000) && (v.startsWith('/') || v.startsWith('https://'))
const isDate = (v: unknown) => v === undefined || (isStr(v, 10) && /^\d{4}-\d{2}-\d{2}$/.test(v))
const isPos = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v > 0 && v < 100_000

/** Confere a estrutura antes de salvar. Devolve a mensagem de erro, ou null se estiver tudo certo. */
export function validateGallery(g: unknown): string | null {
  if (!g || typeof g !== 'object') return 'Dados inválidos.'
  const { niches, photos } = g as Gallery
  if (!Array.isArray(niches) || !Array.isArray(photos)) return 'Dados inválidos.'
  if (niches.length > 200 || photos.length > 5000) return 'Galeria grande demais.'
  const ids = new Set<string>()
  for (const n of niches) {
    if (!isId(n?.id) || !isStr(n.label, 80) || !n.label.trim()) return 'Nicho com nome ou identificador inválido.'
    if (n.description !== undefined && !isStr(n.description, 1000)) return `Descrição longa demais no nicho "${n.label}".`
    if (ids.has(n.id)) return `Nicho repetido: "${n.label}".`
    ids.add(n.id)
  }
  for (const p of photos) {
    if (!isStr(p?.id, 100) || !isUrl(p.src) || !isUrl(p.thumb) || !isPos(p.width) || !isPos(p.height)) return 'Foto com dados inválidos.'
    if (!ids.has(p.niche)) return 'Há uma foto em um nicho que não existe.'
    if (p.title !== undefined && !isStr(p.title, 200)) return 'Nome de foto longo demais.'
    if (!isDate(p.date)) return 'Data de foto inválida.'
  }
  return null
}

export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
