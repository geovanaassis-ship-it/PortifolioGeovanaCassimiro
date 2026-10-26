import type { Category, PhotoSeries } from './types'
import galleryData from './photo-gallery.json'

/**
 * FOTOGRAFIA E AUDIOVISUAL
 *
 * Categorias: edite, renomeie ou reordene à vontade. Uma categoria só aparece
 * nos filtros se tiver pelo menos um ensaio.
 */
export const photoCategories: Category[] = [
  { id: 'eventos', label: 'Eventos' },
  { id: 'retratos', label: 'Retratos' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'comercial', label: 'Comercial' },
  { id: 'marcas', label: 'Estabelecimentos e marcas' },
  { id: 'audiovisual', label: 'Audiovisual' },
]

/**
 * ENSAIOS
 *
 * As fotos NÃO são listadas aqui: elas vêm de src/content/photo-gallery.json,
 * gerado pelo comando `npm run fotos` (ou automaticamente pelo GitHub — ver README,
 * "Adicionar fotos à galeria").
 *
 * Aqui ficam só o título, a categoria e o texto de cada ensaio, ligados pelo slug
 * (o nome da pasta em fotos/, em minúsculas e sem acento: "Viola Dance" → "viola-dance"; para fotos
 * soltas, o trecho do nome do arquivo depois do último " - ": "Evento - Hamburgada(2).jpg" → "hamburgada").
 * A ordem desta lista é a ordem em que os ensaios aparecem no site.
 * Pastas de fotos sem bloco aqui também aparecem, com o nome da pasta como título.
 */
const seriesInfo: Omit<PhotoSeries, 'photos'>[] = [
  {
    slug: 'aniversario',
    title: 'Aniversário',
    category: 'eventos',
  },
  {
    slug: 'corrida',
    title: 'Corrida',
    category: 'eventos',
  },
  {
    slug: 'hamburgada',
    title: 'Hamburgada do Bem',
    category: 'eventos',
    description: 'Registro fotográfico voluntário das ações solidárias da Hamburgada do Bem.',
  },
  {
    slug: 'viola-dance',
    title: 'Viola Dance',
    category: 'comercial',
    description: 'Fotografia publicitária.',
  },
]

/** Vídeos e ensaios sem fotos (YouTube/Vimeo entram com o ID; Reels e TikToks entram como link). */
const extraSeries: PhotoSeries[] = [
  {
    slug: 'exemplo-audiovisual',
    title: 'Produção audiovisual',
    category: 'audiovisual',
    year: '[ANO]',
    description: '[A PREENCHER] Vídeos do YouTube/Vimeo entram com o ID; Reels e TikToks entram como link.',
    placeholder: true,
    photos: [],
    videos: [{ kind: 'video', provider: 'youtube', source: '', title: 'Espaço reservado para vídeo' }],
  },
]

/* ---------- Montagem (não precisa editar abaixo) ---------- */

const gallery = galleryData as Record<string, { src: string; thumb?: string; width: number; height: number }[]>

const titleFromSlug = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')

const withPhotos = (info: Omit<PhotoSeries, 'photos'>): PhotoSeries => ({
  ...info,
  photos: (gallery[info.slug] ?? []).map((p, i) => ({ ...p, alt: `${info.title} — foto ${i + 1}` })),
})

export const photoSeries: PhotoSeries[] = [
  ...seriesInfo.map(withPhotos).filter((s) => s.photos.length || s.videos?.length),
  ...Object.keys(gallery)
    .filter((slug) => !seriesInfo.some((s) => s.slug === slug))
    .map((slug) => withPhotos({ slug, title: titleFromSlug(slug), category: 'eventos' })),
  ...extraSeries,
]
