# Portfólio — Geovana Cassimiro

Site-portfólio de Publicidade e Comunicação. React 19 + TypeScript + Vite + Tailwind CSS 4 + React Router.

- [Rodar no computador](#rodar-no-computador)
- [Onde fica cada coisa](#onde-fica-cada-coisa)
- [Adicionar um projeto](#adicionar-um-projeto)
- [Adicionar fotos e vídeos](#adicionar-fotos-e-vídeos)
- [Trocar textos, links e imagens](#trocar-textos-links-e-imagens)
- [Publicar na internet](#publicar-na-internet)
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
  images/               ← todas as imagens (ver images/LEIA-ME.md)
  favicon.svg, og-image.png, apple-touch-icon.png
src/
  content/              ← TODO O CONTEÚDO EDITÁVEL ESTÁ AQUI
    site.ts             ← nome, e-mail, LinkedIn, Instagram, WhatsApp, categorias, menu
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

Os projetos das abas **More Invest**, **CACO e C360** e **Outros projetos** são gerenciados na
área de admin (`/abc` → aba **Projetos**):

1. Escolha a aba do site e clique em **Novo projeto**.
2. Preencha título, categoria, ano, resumo e (opcional) sua participação. Marque
   **Trabalhos em destaque** para o projeto aparecer na página inicial.
3. Envie a **capa** (recortada em 4:3 no card).
4. Opcional — **página do projeto**: o que você fez, contexto, objetivo, desafio, estratégia,
   processo, resultado, ferramentas, entregáveis, imagens, vídeos do YouTube/Vimeo e links.
   Com qualquer um desses campos, o projeto ganha página própria; sem eles, o card leva ao
   primeiro link.
5. **Salvar projeto** — já aparece no site.

Por trás: os dados ficam no Vercel Blob (`projetos/dados-*.json`, com as 10 últimas versões
guardadas) e as imagens em `projetos/fotos/<aba>/`. O formato está em `src/lib/projects-data.ts`.

## Adicionar fotos e vídeos

### Fotos da galeria — área de admin

A galeria de `/fotografia` é gerenciada em **`/abc`** (não aparece no menu nem no Google):

- **Enviar fotos:** escolha o nicho e arraste as fotos (pode ser no tamanho original — o navegador
  reduz para 2000 px + miniatura de 900 px em WEBP e remove o GPS). A data é lida da própria foto.
- **Nichos:** são os filtros da galeria. Crie, renomeie, reordene e escreva uma descrição.
- **Fotos:** dê um nome (aparece ao passar o mouse), ajuste a data, troque o nicho, mude a ordem ou apague.
  Clique em **Salvar alterações** no fim.

Como funciona por trás: as funções em `api/` (login, galeria e envio) rodam na Vercel; fotos e dados
ficam no **Vercel Blob**. Os dados são salvos como um arquivo novo a cada alteração, e as 10 últimas
versões ficam guardadas como cópia de segurança. Enquanto nada for salvo pelo admin, o site mostra
`public/galeria-inicial.json`.

**Configuração na Vercel (uma vez):**
1. *Storage → Create → Blob* e conecte ao projeto (cria `BLOB_READ_WRITE_TOKEN` sozinho).
2. *Settings → Environment Variables:* `ADMIN_PASSWORD` = sua senha (longa).
   Opcional: `ADMIN_SESSION_SECRET` = um texto aleatório longo.
3. Publique de novo (*Deployments → Redeploy*).

**No computador:** crie `.env.local` com `ADMIN_PASSWORD=...` e rode `npm run dev`. Sem
`BLOB_READ_WRITE_TOKEN`, as fotos enviadas ficam em `public/dev-uploads/` (fora do Git).

### Vídeos

Em `photoSeries`, em `src/content/photography.ts`:

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

## Trocar textos, links e imagens

| O quê | Onde |
|---|---|
| E-mail, LinkedIn, Instagram, outros canais | `src/content/site.ts` |
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

## Checklist antes de divulgar

Rode `npm run check:content` — ele lista tudo que ainda falta. Em resumo:

- [ ] E-mail e LinkedIn em `site.ts`
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
