import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { allProjects } from './src/content/projects'
import { site } from './src/content/site'

/** Gera sitemap.xml e robots.txt no build a partir das rotas e projetos cadastrados. */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const base = siteUrl.replace(/\/$/, '')
      const visible = allProjects.filter((p) => site.showPlaceholders || !p.placeholder)
      const paths = [
        '/',
        '/sobre',
        '/more-invest',
        '/caco-c360',
        '/fotografia',
        '/outros-projetos',
        '/contato',
        ...visible.filter((p) => p.hasDetail).map((p) => p.path),
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), seoFiles(env.VITE_SITE_URL || 'http://localhost:4173')],
  }
})
