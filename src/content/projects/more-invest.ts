import type { ProjectInput } from '../types'

/**
 * MORE INVEST — trabalhos de marketing.
 * Publique só materiais já divulgados publicamente pela empresa.
 * Não inclua dados internos, informações de clientes/investidores ou métricas não autorizadas.
 *
 * Os dois itens abaixo são EXEMPLOS (placeholder: true). Substitua-os pelos seus trabalhos
 * ou apague-os. Veja o README para o passo a passo.
 */
export const moreInvestProjects: ProjectInput[] = [
  {
    slug: 'exemplo-projeto-completo',
    title: 'Título do projeto',
    category: 'campanhas',
    summary: '[A PREENCHER] Uma ou duas frases sobre o que é o projeto e por que ele existe.',
    year: '[ANO]',
    area: 'Campanhas e projetos especiais',
    featured: true,
    featuredOrder: 1,
    placeholder: true,
    role: '[A PREENCHER] Seu papel em uma linha',
    responsibilities: [
      '[A PREENCHER] O que você fez — ex.: redação dos posts',
      '[A PREENCHER] Outra responsabilidade',
    ],
    context: '[A PREENCHER] Em que contexto o projeto surgiu? Qual era a necessidade da marca?',
    objective: '[A PREENCHER] O que a comunicação precisava alcançar?',
    challenge: '[A PREENCHER] Opcional: qual era a principal dificuldade (público, tema técnico, prazo)?',
    strategy: '[A PREENCHER] Qual foi o conceito ou caminho escolhido e por quê?',
    process: '[A PREENCHER] Opcional: como o trabalho foi desenvolvido, etapa por etapa.',
    tools: ['[FERRAMENTA]'],
    deliverables: ['[ENTREGÁVEL]'],
    tags: ['exemplo'],
  },
  {
    slug: 'exemplo-post-simples',
    title: 'Publicação para redes sociais',
    category: 'redes-sociais',
    summary: '[A PREENCHER] Exemplo de item simples: só imagem, uma frase e o link do post original.',
    year: '[ANO]',
    placeholder: true,
  },
]
