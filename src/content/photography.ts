import type { Category, PhotoSeries } from './types'

/**
 * FOTOGRAFIA E AUDIOVISUAL
 *
 * As FOTOS da galeria não ficam aqui: são enviadas e organizadas pela área de
 * admin do site (/abc), com nichos, nomes e datas.
 *
 * Este arquivo guarda só os VÍDEOS, exibidos abaixo da galeria.
 * YouTube/Vimeo entram com o ID; Reels e TikToks entram como link.
 */
export const photoCategories: Category[] = [{ id: 'audiovisual', label: 'Audiovisual' }]

export const photoSeries: PhotoSeries[] = [
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
