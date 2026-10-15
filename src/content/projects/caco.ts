import type { ProjectInput } from '../types'

/**
 * CACO — Centro Acadêmico de Comunicação (atuação como Head de Conteúdo).
 * Em trabalhos coletivos, preencha `collaborators` para dar crédito à equipe.
 */
export const cacoProjects: ProjectInput[] = [
  {
    slug: 'exemplo-planejamento-de-conteudo',
    title: 'Planejamento de conteúdo',
    category: 'planejamento',
    summary: '[A PREENCHER] Ex.: como o conteúdo do centro acadêmico foi organizado ao longo do semestre.',
    year: '[ANO]',
    area: 'Planejamento de conteúdo',
    featured: true,
    featuredOrder: 2,
    placeholder: true,
    role: 'Head de Conteúdo',
    responsibilities: ['[A PREENCHER] Responsabilidade', '[A PREENCHER] Responsabilidade'],
    collaborators: [{ name: '[NOME]', role: '[FUNÇÃO]' }],
    context: '[A PREENCHER] Contexto do projeto.',
    strategy: '[A PREENCHER] Como você organizou o trabalho.',
  },
]
