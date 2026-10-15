import type { Category, SectionId } from './types'

/**
 * CONFIGURAÇÕES GERAIS DO SITE
 * Links, contatos, currículo e textos curtos de apresentação.
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

  /** E-mail profissional. [A PREENCHER] */
  email: null as string | null,

  socials: {
    /** URL completa do perfil. [A PREENCHER] */
    linkedin: null as string | null,
    /** Instagram profissional (opcional). [A PREENCHER] */
    instagram: null as string | null,
    /** Outros canais opcionais, ex.: Behance, YouTube. */
    others: [] as { label: string; url: string }[],
  },

  /**
   * Currículo em PDF. Coloque o arquivo em public/curriculo/ com exatamente este nome.
   * O botão só aparece quando o arquivo existe de verdade (o site verifica sozinho).
   */
  resumePath: '/curriculo/geovana-cassimiro-curriculo.pdf',

  /** Retrato (opcional) exibido na página Sobre. Ex.: { src: '/images/perfil/retrato.webp', alt: '...' } */
  portrait: null as { src: string; alt: string } | null,

  /** Filtros de categoria só aparecem a partir desta quantidade de projetos na seção. */
  minProjectsForFilters: 4,
}

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
