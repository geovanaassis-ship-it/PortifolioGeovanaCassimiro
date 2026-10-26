# Portfólio — Geovana Cassimiro

Site-portfólio de Publicidade e Comunicação. React 19 + TypeScript + Vite + Tailwind CSS 4 + React Router.

- [Rodar no computador](#rodar-no-computador)
- [Onde fica cada coisa](#onde-fica-cada-coisa)
- [Adicionar um projeto](#adicionar-um-projeto)
- [Adicionar fotos e vídeos](#adicionar-fotos-e-vídeos)
- [Trocar textos, links, currículo e imagens](#trocar-textos-links-currículo-e-imagens)
- [Publicar na internet](#publicar-na-internet)
- [Formulário de contato (opcional)](#formulário-de-contato-opcional)
- [Checklist antes de divulgar](#checklist-antes-de-divulgar)
- [Direção de arte](#direção-de-arte)

---

## Rodar no computador

Requisito: [Node.js](https://nodejs.org) 20 ou superior.

```bash
npm install          # instala as dependências (só na primeira vez)
npm run dev          # abre em http://localhost:5173 e atualiza ao salvar
npm run build        # gera a versão final em /dist (e confere erros de TypeScript)
npm run preview      # mostra a versão final em http://localhost:4173
npm run check:content  # lista tudo que ainda está marcado como [A PREENCHER]
```

## Onde fica cada coisa

```
public/
  curriculo/            ← PDF do currículo
  images/               ← todas as imagens (ver images/LEIA-ME.md)
  favicon.svg, og-image.png, apple-touch-icon.png
src/
  content/              ← TODO O CONTEÚDO EDITÁVEL ESTÁ AQUI
    site.ts             ← nome, e-mail, LinkedIn, Instagram, currículo, categorias, menu
    about.ts            ← frase de apresentação, textos do "Sobre mim", linha do tempo, competências, ferramentas
    photography.ts      ← categorias e ensaios de fotografia/audiovisual
    projects/
      more-invest.ts    ← projetos da More Invest
      caco.ts           ← projetos do CACO
      c360.ts           ← projetos do Portal C360
      outros.ts         ← outros projetos
    types.ts            ← descrição de todos os campos disponíveis
  components/           ← peças visuais reutilizáveis (cards, galeria, lightbox, selo, bolas de sinuca…)
  pages/                ← uma página por aba (os textos de introdução de cada aba ficam aqui)
  styles/index.css      ← paleta, fontes e estilos globais
```

## Adicionar um projeto

1. Coloque as imagens em `public/images/<seção>/` (ex.: `public/images/more-invest/`).
2. Abra o arquivo da seção em `src/content/projects/` e adicione um bloco à lista:

**Projeto simples** (um post, uma peça) — sem página própria, o card leva direto ao link original:

```ts
{
  slug: 'post-tesouro-direto',
  title: 'Carrossel: o que é o Tesouro Direto',
  category: 'redes-sociais',
  summary: 'Carrossel explicando o produto para quem está começando a investir.',
  year: '2025',
  cover: { src: '/images/more-invest/tesouro-capa.webp', alt: 'Primeiro card do carrossel com o título…' },
  links: [{ label: 'Instagram', url: 'https://www.instagram.com/p/XXXXX/' }],
},
```

**Projeto completo** — preencha os campos que fizerem sentido; o site cria a página `/more-invest/<slug>` sozinho:

```ts
{
  slug: 'campanha-x',
  title: 'Campanha X',
  category: 'campanhas',
  summary: 'Resumo em uma ou duas frases.',
  year: '2025',
  area: 'Campanhas e projetos especiais',
  featured: true,            // aparece em "Trabalhos em destaque" na página inicial
  featuredOrder: 1,          // ordem entre os destaques
  cover: { src: '/images/more-invest/campanha-x-capa.webp', alt: '…' },
  role: 'Redação e direção de arte',
  responsibilities: ['Roteiro dos vídeos', 'Redação das legendas'],
  collaborators: [{ name: 'Fulana', role: 'Design' }],   // trabalhos em grupo
  context: 'Parágrafo.\n\nOutro parágrafo.',
  objective: '…',
  challenge: '…',
  strategy: '…',
  process: '…',
  result: { text: 'Só resultados comprovados.', source: 'Relatório do Instagram, mar/2025' },
  tools: ['Figma', 'Premiere'],
  deliverables: ['3 vídeos', '6 cards'],
  tags: ['finanças'],
  gallery: [
    { src: '/images/more-invest/campanha-x-1.webp', alt: '…', width: 1080, height: 1350, caption: 'Legenda opcional' },
    { kind: 'video', provider: 'youtube', source: 'ID_DO_VIDEO', title: 'Vídeo da campanha' },
  ],
  links: [{ label: 'Ver no LinkedIn', url: 'https://…' }],
},
```

Regras rápidas:
- `slug`: só letras minúsculas, números e hífens; não pode repetir (CACO e C360 dividem o mesmo endereço, então os slugs também não podem se repetir entre eles).
- `category`: precisa ser um dos `id` listados em `sections` dentro de `src/content/site.ts`. Para criar/renomear categorias, edite lá.
- Os filtros por categoria aparecem sozinhos quando a seção tiver 4 projetos ou mais (ajuste em `minProjectsForFilters`).
- Em modo de desenvolvimento, o console do navegador avisa sobre slug repetido ou categoria inexistente.

## Adicionar fotos e vídeos

### Fotos da galeria (automático)

1. No GitHub, abra a pasta `fotos/` e clique em **Add file → Upload files**.
2. Arraste **uma pasta por ensaio** (ex.: `Aniversário`, `Corrida`), com as fotos no tamanho original.
3. Clique em **Commit changes**.

Em poucos minutos a ação **Processar fotos** (aba *Actions*) reduz as fotos para a web
(lado maior de 2000 px, mais uma miniatura de 900 px, em `.webp`), remove os dados de GPS,
coloca tudo em `public/images/fotografia/<ensaio>/`, atualiza `src/content/photo-gallery.json`
e apaga os originais de `fotos/`. Fotos novas em um ensaio que já existe entram no fim.

No computador, o mesmo processo roda com `npm run fotos`.

Para dar título, categoria e texto a um ensaio, edite `seriesInfo` em `src/content/photography.ts`
(o `slug` é o nome da pasta em minúsculas, sem acento e com hífens). Para tirar uma foto, apague
o `.webp` e o `-thumb.webp` dela em `public/images/fotografia/<ensaio>/` e rode `npm run fotos`
(ou faça qualquer envio para `fotos/`).

### Vídeos

Em `extraSeries`, no mesmo arquivo:

```ts
{
  slug: 'videos',
  title: 'Produção audiovisual',
  category: 'audiovisual',
  photos: [],
  videos: [{ kind: 'video', provider: 'youtube', source: 'ID_DO_VIDEO', title: 'Teaser' }],
  links: [{ label: 'Ver no Instagram', url: 'https://www.instagram.com/p/XXXXX/' }],
},
```

- Fotos mantêm a proporção original (sem cortes) e abrem em um lightbox com setas, teclado e gesto de deslizar.
- Vídeos do YouTube/Vimeo: use só o ID (o trecho depois de `v=` ou o número do Vimeo). O player só carrega quando a pessoa clica.
- Reels e TikToks não têm incorporação confiável: adicione como `links`.
- Categorias (`photoCategories`) podem ser renomeadas, removidas ou reordenadas.

## Trocar textos, links, currículo e imagens

| O quê | Onde |
|---|---|
| E-mail, LinkedIn, Instagram, outros canais | `src/content/site.ts` |
| Currículo | coloque `geovana-cassimiro-curriculo.pdf` em `public/curriculo/`. O botão aparece sozinho. |
| Retrato da página Sobre | imagem em `public/images/perfil/` + `portrait` em `site.ts` |
| Frase de apresentação, textos do Sobre, linha do tempo, competências, ferramentas | `src/content/about.ts` |
| Texto de introdução de cada aba | o arquivo da página em `src/pages/` |
| Cores e fontes | `src/styles/index.css` (bloco `@theme`) |
| Favicon e imagem de compartilhamento | `public/favicon.svg` e `public/og-image.png` (1200 × 630) |
| Ícones de interface | `src/components/ui/Icon.tsx` |

## Publicar na internet

O site é estático: qualquer hospedagem de sites estáticos serve. A recomendação é a **Vercel** (gratuita, publica de novo sozinha a cada alteração no GitHub):

1. Crie uma conta em [vercel.com](https://vercel.com) entrando com o GitHub.
2. **Add New → Project** → escolha o repositório `PortifolioGeovanaCassimiro`.
3. A Vercel detecta o Vite sozinha (Build: `npm run build`, Output: `dist`). Clique em **Deploy**.
4. O site fica em `https://<nome-do-projeto>.vercel.app`. Para ficar `geovanacassimiro.vercel.app`, dê esse nome ao projeto (se estiver disponível).
5. Em **Settings → Environment Variables**, defina `VITE_SITE_URL` com o endereço final (ex.: `https://geovanacassimiro.vercel.app`) e faça um novo deploy. Esse endereço é usado na prévia de compartilhamento (LinkedIn/WhatsApp) e no `sitemap.xml`.
6. **Domínio próprio (opcional):** compre um domínio (ex.: `geovanacassimiro.com.br` no Registro.br) e adicione em **Settings → Domains**; atualize `VITE_SITE_URL`.

O arquivo `vercel.json` já faz as rotas (`/sobre`, `/more-invest/...`) funcionarem ao abrir o link direto. Na **Netlify**, o equivalente é `public/_redirects` (também incluído). O GitHub Pages não é recomendado porque exige ajustes extras para rotas.

**Sobre a prévia de compartilhamento:** LinkedIn e WhatsApp leem as tags do `index.html`, que valem para o site todo (título, descrição e `og-image.png`). Os títulos de cada página mudam no navegador e no Google, mas a prévia em redes sociais é a mesma para todos os links.

## Formulário de contato (opcional)

Por padrão, a página de contato mostra e-mail (com botão de copiar) e redes — **sem formulário**, para não exibir um formulário que não envia nada.

Para ativar um formulário que envia de verdade, usando o [Formspree](https://formspree.io) (plano gratuito: 50 mensagens/mês):

1. Crie uma conta e um formulário; copie o ID (o trecho final do endpoint, ex.: `xyzabcd`).
2. Defina a variável `VITE_FORMSPREE_ID=xyzabcd` na Vercel (Settings → Environment Variables) e faça um novo deploy. Para testar localmente, crie um arquivo `.env.local` com a mesma linha.
3. Confirme o primeiro envio pelo e-mail que o Formspree mandar.

## Checklist antes de divulgar

Rode `npm run check:content` — ele lista tudo que ainda falta. Em resumo:

- [ ] E-mail e LinkedIn em `site.ts`
- [ ] Currículo em PDF em `public/curriculo/`
- [ ] Datas, instituição da graduação em ADS e ferramentas em `about.ts`
- [ ] Projetos reais nas seções; itens de exemplo apagados ou com `placeholder: false`
- [ ] Participação confirmada nos formatos do Portal C360 (`c360.ts`) — apague os que não forem seus
- [ ] Fotos reais em `photography.ts`
- [ ] **`showPlaceholders: false`** em `site.ts` — esconde todos os exemplos e avisos "a configurar"
- [ ] `VITE_SITE_URL` com o endereço final

## Direção de arte

Construída a partir das referências enviadas:

- **Paleta** — cartelas "lotus pond" e "bamboo": fundo papel *Oat* `#F0E6DA`, texto *Dark green* `#0A3323`, acentos *Cherry* `#76070D`, *Midnight green* `#105666`, *Moss* `#839958`, *Olive* `#4F6815`, *Rosy brown* `#D3968C`, *Butter* `#FFEDAB`, *Beige* `#F7F4D5`. Cada seção tem uma cor (More Invest = midnight, CACO = cherry, C360 = olive, Fotografia = dark green, Outros = rosy). Moss e rosy não são usados como texto sobre fundo claro, por contraste.
- **Cartelas de cor** — os atalhos da home e o menu mobile são "cartelas" empilhadas, com código e nome, como nas referências.
- **Letras recortadas** — o nome na home usa letras em colagem (referência do alfabeto recortado), só ali e no 404.
- **Câmeras digitais** — o hero e o retrato do Sobre ficam numa câmera compacta desenhada em CSS; o lightbox usa linguagem de visor (REC, `IMG_0001`).
- **Estrelas** — patches bordados e "puffy" como stickers decorativos.
- **Selos de cera** — selo "gc" em relevo como assinatura (destaques, rodapé, contato).
- **Miçangas** — palavras curtas em contas de letras (Sobre e Contato).
- **Bolas de sinuca** — toda numeração do site (seções, etapas, competências).
- **Tipografia** — Fraunces (serifada editorial, títulos), Instrument Sans (texto), DM Mono (rótulos, como os códigos hex das cartelas). Fontes hospedadas no próprio site.

## Futuro: CMS

Se editar arquivos `.ts` ficar trabalhoso, dá para conectar um CMS sem mudar o visual — por exemplo **Decap CMS** (gratuito, salva no próprio GitHub) ou **Sanity**. Os componentes já leem de uma estrutura de dados central; bastaria trocar a origem dos dados em `src/content/`.
