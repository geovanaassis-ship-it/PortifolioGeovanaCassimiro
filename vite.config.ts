import { existsSync } from 'node:fs'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Gera sitemap.xml e robots.txt no build a partir das rotas e projetos cadastrados. */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const base = siteUrl.replace(/\/$/, '')
      const paths = [
        '/',
        '/sobre',
        '/more-invest',
        '/caco-c360',
        '/fotografia',
        '/outros-projetos',
        '/contato',
      ]
      const urls = paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
      })
    },
  }
}

/**
 * Em `npm run dev`, atende /api/* com as mesmas funções que rodam na Vercel (pasta api/).
 * Sem BLOB_READ_WRITE_TOKEN, as fotos ficam em public/dev-uploads/ (ver api/_lib/store.ts).
 */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const name = url.pathname.match(/^\/api\/([a-z-]+)$/)?.[1]
        const file = name && `./api/${name}.ts`
        if (!file || !existsSync(file)) return next()
        try {
          const mod = (await server.ssrLoadModule(file)) as Record<string, (r: Request) => Response | Promise<Response>>
          const handler = mod[req.method ?? 'GET']
          if (!handler) {
            res.statusCode = 405
            return res.end()
          }
          const chunks: Buffer[] = []
          for await (const c of req) chunks.push(c as Buffer)
          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
          const body = chunks.length && req.method !== 'GET' && req.method !== 'HEAD' ? Buffer.concat(chunks) : undefined
          const response = await handler(new Request(url, { method: req.method, headers, body }))
          res.statusCode = response.status
          response.headers.forEach((v, k) => res.setHeader(k, v))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (err) {
          console.error(err)
          res.statusCode = 500
          res.end(String(err))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Variáveis do servidor (ADMIN_PASSWORD etc.) para as funções em desenvolvimento.
  for (const key of ['ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET', 'BLOB_READ_WRITE_TOKEN']) if (env[key]) process.env[key] ??= env[key]
  return {
    plugins: [react(), tailwindcss(), devApi(), seoFiles(env.VITE_SITE_URL || 'http://localhost:4173')],
  }
})
