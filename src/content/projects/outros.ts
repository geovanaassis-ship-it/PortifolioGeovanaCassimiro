import type { ProjectInput } from '../types'

/**
 * OUTROS PROJETOS — trabalhos acadêmicos, experimentais e estudos de caso.
 * Trabalhos em grupo: descreva sua contribuição individual em `responsibilities`
 * e liste a equipe em `collaborators`.
 */
export const otherProjects: ProjectInput[] = [
  {
    slug: 'exemplo-trabalho-academico',
    title: 'Campanha acadêmica',
    category: 'academico',
    summary: '[A PREENCHER] Ex.: campanha desenvolvida na disciplina [NOME], a partir de um briefing real ou fictício.',
    year: '[ANO]',
    area: 'Trabalho acadêmico',
    placeholder: true,
    role: '[A PREENCHER] Sua função no grupo',
    responsibilities: ['[A PREENCHER] Sua contribuição individual'],
    collaborators: [{ name: '[NOME]' }, { name: '[NOME]' }],
    context: '[A PREENCHER] Briefing: quem era o cliente e qual era o problema?',
    process: '[A PREENCHER] Pesquisa e planejamento.',
    strategy: '[A PREENCHER] Conceito criativo.',
    deliverables: ['[PEÇA]', '[PEÇA]'],
  },
]
