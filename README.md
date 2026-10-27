# Portfólio — Geovana Cassimiro

Site-portfólio de Publicidade e Comunicação: https://portfolio-geovana-cassimiro.vercel.app

React + TypeScript + Vite + Tailwind CSS, publicado na Vercel.

## Atualizar o conteúdo

- **Projetos** (More Invest, CACO e C360, Outros) e **galeria de fotos**: pela área de admin em `/abc`, com senha.
- **Textos fixos** (apresentação, "Sobre mim", linha do tempo, contatos): arquivos em `src/content/`.

## Rodar no computador

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera a versão final em /dist
```

Para usar o admin localmente, crie um `.env.local` com `ADMIN_PASSWORD=...`.

## Configuração na Vercel

| Variável | Para quê |
|---|---|
| `ADMIN_PASSWORD` | senha da área de admin |
| `ADMIN_SESSION_SECRET` | chave do login (texto aleatório longo) |
| `BLOB_READ_WRITE_TOKEN` | armazenamento de fotos e dados (criado ao conectar o Blob) |
| `VITE_SITE_URL` | endereço público do site |

Depois de mudar uma variável, publique de novo (*Deployments → Redeploy*).
