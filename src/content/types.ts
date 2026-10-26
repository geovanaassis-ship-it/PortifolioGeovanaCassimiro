/**
 * Tipos do conteúdo do portfólio.
 * Todos os campos marcados com "?" são opcionais: preencha só o que fizer sentido para cada trabalho.
 */

/** Imagem local (em /public/images/...) ou URL externa válida. */
export interface MediaImage {
  /** Caminho a partir de /public, ex.: "/images/more-invest/campanha-capa.webp" */
  src: string
  /** Descrição da imagem para leitores de tela (obrigatório). */
  alt: string
  /** Versão menor (opcional), usada nas grades; `src` fica para a imagem ampliada. */
  thumb?: string
  /** Largura e altura originais em px — evitam "pulos" no layout enquanto a imagem carrega. */
  width?: number
  height?: number
  /** Legenda opcional exibida na galeria e no lightbox. */
  caption?: string
}

/** Vídeo hospedado no YouTube/Vimeo ou arquivo .mp4 local. */
export interface MediaVideo {
  kind: 'video'
  provider: 'youtube' | 'vimeo' | 'file'
  /** YouTube/Vimeo: o ID do vídeo (o trecho final da URL). File: caminho do .mp4. */
  source: string
  title: string
  poster?: string
  caption?: string
}

export type GalleryItem = MediaImage | MediaVideo

export const isVideo = (item: GalleryItem): item is MediaVideo => 'kind' in item && item.kind === 'video'

export interface ExternalLinkItem {
  label: string
  url: string
  kind?: 'instagram' | 'linkedin' | 'youtube' | 'site' | 'tiktok' | 'outro'
}

export interface Collaborator {
  name: string
  role?: string
}

/** Seções que recebem projetos. A fotografia tem um modelo próprio (ver photography.ts). */
export type SectionId = 'more-invest' | 'caco' | 'c360' | 'outros'

export interface ProjectInput {
  /** Parte final da URL: só letras minúsculas, números e hífens. Precisa ser único na seção. */
  slug: string
  title: string
  /** ID de uma categoria da seção (ver sections em site.ts). */
  category: string
  /** Resumo curto (1–2 frases) exibido no card. */
  summary: string
  year?: string
  /** Área de atuação, ex.: "Conteúdo para redes sociais". */
  area?: string
  cover?: MediaImage
  /** Aparece em "Trabalhos em destaque" na página inicial. */
  featured?: boolean
  /** Ordem dentro dos destaques (menor aparece primeiro). */
  featuredOrder?: number
  /**
   * Marca o item como modelo/espaço reservado. Ele aparece com um selo "Exemplo"
   * e some do site quando `showPlaceholders` estiver como false em site.ts.
   */
  placeholder?: boolean

  /** Seu papel, em uma linha. Ex.: "Redação e direção de arte". */
  role?: string
  /** O que você fez, em itens. */
  responsibilities?: string[]
  /** Trabalho em grupo: liste quem participou. */
  collaborators?: Collaborator[]

  /** Textos longos. Use uma linha em branco (\n\n) para separar parágrafos. */
  context?: string
  objective?: string
  challenge?: string
  strategy?: string
  process?: string
  /** Só preencha com resultados comprovados. `source` indica de onde vem o dado. */
  result?: { text: string; source?: string }

  tools?: string[]
  deliverables?: string[]
  tags?: string[]
  gallery?: GalleryItem[]
  links?: ExternalLinkItem[]
}

export interface Project extends ProjectInput {
  section: SectionId
  /** URL interna da página do projeto. */
  path: string
  /** Se false, o card não abre página própria (vai direto ao link externo, se houver). */
  hasDetail: boolean
}

export interface Category {
  id: string
  label: string
}

/* ---------- Fotografia e audiovisual ---------- */

export interface PhotoSeries {
  slug: string
  title: string
  /** ID de uma categoria de photoCategories (photography.ts). */
  category: string
  year?: string
  description?: string
  /** Cliente, local ou contexto (opcional). */
  client?: string
  photos: MediaImage[]
  videos?: MediaVideo[]
  links?: ExternalLinkItem[]
  placeholder?: boolean
}
