import type { Category, PhotoSeries } from './types'

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
 * Ensaios / trabalhos. Para adicionar um novo, copie um bloco, troque os dados
 * e coloque as fotos em public/images/fotografia/<slug-do-ensaio>/.
 *
 * Fotos: exporte em .webp ou .jpg com o lado maior entre 1600 e 2400 px.
 * Informe width e height reais de cada foto — assim a galeria mantém a proporção
 * original, sem cortes.
 *
 * Os ensaios abaixo são ESPAÇOS RESERVADOS (placeholder: true), sem fotos reais.
 */
export const photoSeries: PhotoSeries[] = [
  {
    slug: 'exemplo-ensaio-evento',
    title: 'Título do ensaio',
    category: 'eventos',
    year: '[ANO]',
    description: '[A PREENCHER] Opcional: contexto do ensaio — onde, para quem, com qual intenção.',
    placeholder: true,
    photos: [
      { src: '', alt: 'Espaço reservado para foto', width: 1600, height: 2000 },
      { src: '', alt: 'Espaço reservado para foto', width: 2400, height: 1600 },
      { src: '', alt: 'Espaço reservado para foto', width: 1600, height: 1600 },
      { src: '', alt: 'Espaço reservado para foto', width: 1600, height: 2400 },
      { src: '', alt: 'Espaço reservado para foto', width: 2400, height: 1600 },
    ],
  },
  {
    slug: 'exemplo-retratos',
    title: 'Retratos',
    category: 'retratos',
    year: '[ANO]',
    placeholder: true,
    photos: [
      { src: '', alt: 'Espaço reservado para foto', width: 1600, height: 2000 },
      { src: '', alt: 'Espaço reservado para foto', width: 1600, height: 2000 },
      { src: '', alt: 'Espaço reservado para foto', width: 1600, height: 2000 },
    ],
  },
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
