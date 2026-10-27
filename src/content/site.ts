import type { Category, SectionId } from './types'

/**
 * CONFIGURAÇÕES GERAIS DO SITE
 * Links, contatos e textos curtos de apresentação.
 * Campos com valor null ficam ocultos no site (ou aparecem como "a configurar"
 * enquanto showPlaceholders estiver true).
 */
export const site = {
  name: 'Geovana Cassimiro',
  /** Usado no <title> e nos cards de compartilhamento. */
  role: 'Publicidade, marketing e produção visual',
  description:
    'Portfólio de Geovana Cassimiro, estudante de Publicidade e Propaganda na USCS. Marketing e comunicação corporativa, conteúdo, produção editorial, fotografia e audiovisual.',

  /**
   * Mostra os itens de exemplo (placeholder: true) e os avisos "a configurar".
   * Troque para false antes de enviar o link para recrutadores: os exemplos somem
   * e as seções vazias exibem uma mensagem neutra.
   */
  showPlaceholders: true,

  /** E-mail profissional. */
  email: 'geovana.photomidias@gmail.com' as string | null,

  /**
   * WhatsApp: número completo com DDI, só dígitos. O número não aparece escrito no
   * site; ele só é usado no botão "Chamar no WhatsApp" (link wa.me).
   */
  whatsapp: '5511952177816' as string | null,

  socials: {
    /** URL completa do perfil. */
    linkedin: 'https://www.linkedin.com/in/geovana-cassimiro-774b93208/' as string | null,
    /** Instagram profissional (opcional). */
    instagram: 'https://www.instagram.com/geovana.cassimiro/' as string | null,
    /** Outros canais opcionais, ex.: Behance, YouTube. */
    others: [] as { label: string; url: string }[],
  },

  /** Retrato (opcional) exibido na página Sobre. Ex.: { src: '/images/perfil/retrato.webp', alt: '...' } */
  portrait: {
    src: '/images/perfil/retrato.webp',
    alt: 'Geovana Cassimiro sorrindo, sentada em uma cadeira azul com um joelho dobrado, de blusa verde e calça preta, em frente a um fundo escuro',
    width: 1200,
    height: 1800,
  } as { src: string; alt: string; width?: number; height?: number } | null,

  /** Filtros de categoria só aparecem a partir desta quantidade de projetos na seção. */
  minProjectsForFilters: 4,
}

/** Link do botão de WhatsApp (sem expor o número na página). */
export const whatsappUrl = site.whatsapp ? `https://wa.me/${site.whatsapp}` : null

/* ---------- Seções e categorias ---------- */

export interface SectionMeta {
  id: SectionId
  label: string
  /** Código exibido nos rótulos, no estilo das cartelas de cor. */
  code: string
  path: string
  categories: Category[]
}

export const sections: Record<SectionId, SectionMeta> = {
  'more-invest': {
    id: 'more-invest',
    label: 'More Invest',
    code: '#02',
    path: '/more-invest',
    categories: [
      { id: 'redes-sociais', label: 'Conteúdo para redes sociais' },
      { id: 'institucional', label: 'Comunicação institucional' },
      { id: 'graficos', label: 'Materiais gráficos e apresentações' },
      { id: 'audiovisual', label: 'Produção e edição audiovisual' },
      { id: 'campanhas', label: 'Campanhas e projetos especiais' },
      { id: 'educacao-financeira', label: 'Produtos e conceitos financeiros' },
    ],
  },
  caco: {
    id: 'caco',
    label: 'CACO',
    code: '#03A',
    path: '/caco-c360',
    categories: [
      { id: 'comunicacao-estudantes', label: 'Comunicação com os estudantes' },
      { id: 'planejamento', label: 'Planejamento de conteúdo' },
      { id: 'campanhas', label: 'Campanhas e divulgação' },
      { id: 'pecas-graficas', label: 'Peças gráficas' },
      { id: 'editorial', label: 'Organização editorial' },
      { id: 'acoes', label: 'Projetos e ações acadêmicas' },
      { id: 'coordenacao', label: 'Coordenação de produções' },
    ],
  },
  c360: {
    id: 'c360',
    label: 'Portal C360',
    code: '#03B',
    path: '/caco-c360',
    categories: [
      { id: 'editorial', label: 'Conteúdo editorial' },
      { id: 'redes-sociais', label: 'Publicações para redes sociais' },
      { id: 'cultura-pop', label: 'Semiótica e cultura pop' },
      { id: 'formatos', label: 'Formatos e séries' },
      { id: 'eventos', label: 'Eventos' },
    ],
  },
  outros: {
    id: 'outros',
    label: 'Outros projetos',
    code: '#05',
    path: '/outros-projetos',
    categories: [
      { id: 'academico', label: 'Trabalhos acadêmicos' },
      { id: 'experimental', label: 'Projetos experimentais' },
      { id: 'campanha', label: 'Campanhas da faculdade' },
      { id: 'estudo-de-caso', label: 'Estudos de caso' },
    ],
  },
}

/** Itens do menu principal, na ordem em que aparecem. */
export const navigation = [
  { label: 'Início', path: '/', code: '✶' },
  { label: 'Sobre mim', path: '/sobre', code: '#01' },
  { label: 'More Invest', path: '/more-invest', code: '#02' },
  { label: 'CACO e C360', path: '/caco-c360', code: '#03' },
  { label: 'Fotografia', path: '/fotografia', code: '#04' },
  { label: 'Outros projetos', path: '/outros-projetos', code: '#05' },
  { label: 'Contato', path: '/contato', code: '#06' },
] as const
