/**
 * PÁGINA "SOBRE MIM"
 * Textos em primeira pessoa. Edite livremente — separe parágrafos com itens do array.
 * Itens com [A PREENCHER] precisam ser completados com os dados do currículo.
 */

export const headline = 'Comunicação com método. Imagem com intenção.'

export const intro =
  'Sou estudante de Publicidade e Propaganda na USCS e trabalho com marketing, conteúdo e produção visual. Da formação em Análise e Desenvolvimento de Sistemas, trouxe o hábito de estruturar antes de criar.'

export const story: { title: string; paragraphs: string[] }[] = [
  {
    title: 'Comecei pela tecnologia',
    paragraphs: [
      'Minha primeira formação foi em Análise e Desenvolvimento de Sistemas. Ali aprendi a quebrar problemas em partes, documentar decisões e pensar em quem vai usar aquilo que está sendo construído.',
      'Quando fui para a Publicidade, percebi que esse jeito de pensar não ficou para trás. Ele só mudou de matéria-prima: em vez de código, passei a organizar mensagens, públicos e imagens.',
    ],
  },
  {
    title: 'Comunicação em um ambiente que exige precisão',
    paragraphs: [
      'Hoje estou no 7º semestre de Publicidade e Propaganda e atuo no marketing da More Invest, empresa do mercado financeiro. É um contexto em que cada palavra pesa: a comunicação precisa ser clara para quem está começando e correta para quem já conhece o assunto.',
    ],
  },
  {
    title: 'Na universidade, liderança e experimentação',
    paragraphs: [
      'No CACO, o Centro Acadêmico de Comunicação da USCS, sou Head de Conteúdo: planejo, organizo e acompanho o que o centro acadêmico comunica para os estudantes. Em paralelo, desenvolvo projetos editoriais e criativos ligados ao Portal C360, onde há espaço para testar formatos, linguagens e referências de cultura pop.',
    ],
  },
  {
    title: 'A câmera como forma de pensar',
    paragraphs: [
      'Fotografia e audiovisual são onde treino o olhar: luz, enquadramento, ritmo. E também onde lembro que comunicar é, antes de tudo, escolher o que mostrar.',
    ],
  },
]

/** Linha do tempo resumida. Complete as datas com base no currículo. */
export const timeline: { period: string; title: string; place: string; note?: string }[] = [
  { period: '[ANO] – atual', title: 'Marketing', place: 'More Invest', note: 'Mercado financeiro' },
  { period: '[ANO] – atual', title: 'Head de Conteúdo', place: 'CACO — Centro Acadêmico de Comunicação da USCS' },
  { period: '[ANO] – atual', title: 'Projetos editoriais e criativos', place: 'Portal C360' },
  { period: '[ANO] – atual', title: 'Fotografia e produção audiovisual', place: 'Trabalhos próprios' },
  { period: '[ANO] – atual', title: 'Publicidade e Propaganda', place: 'USCS', note: 'Cursando o 7º semestre' },
  { period: '[ANO] – [ANO]', title: 'Análise e Desenvolvimento de Sistemas', place: '[INSTITUIÇÃO — A PREENCHER]' },
]

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Estratégia',
    items: [
      'Marketing e comunicação corporativa',
      'Planejamento e desenvolvimento de campanhas',
      'Comunicação institucional',
      'Comunicação de temas técnicos para diferentes públicos',
    ],
  },
  {
    group: 'Conteúdo',
    items: ['Criação de conteúdo para redes sociais', 'Redação publicitária', 'Produção editorial'],
  },
  {
    group: 'Imagem',
    items: ['Direção e produção visual', 'Fotografia', 'Produção audiovisual'],
  },
  {
    group: 'Gestão',
    items: ['Gestão de projetos', 'Liderança de equipes criativas'],
  },
]

/** Ferramentas que você realmente usa — copie do currículo. */
export const tools: string[] = ['[A PREENCHER com as ferramentas do currículo]']
