// Lista o que ainda precisa ser preenchido no conteúdo do site.
// Uso: npm run check:content
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const MARK = /\[(A PREENCHER|A CONFIRMAR|ANO|NOME|FUNÇÃO|FERRAMENTA|ENTREGÁVEL|PEÇA|INSTITUIÇÃO)[^\]]*\]/g
const files = []
const walk = (d) => readdirSync(d).forEach((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : f.endsWith('.ts') && files.push(join(d, f))))
walk('src/content')

let total = 0
for (const f of files) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const hits = line.match(MARK)
    if (hits) {
      total += hits.length
      console.log(`${f}:${i + 1}  ${hits.join(' ')}`)
    }
  })
}

const site = readFileSync('src/content/site.ts', 'utf8')
const pending = []
if (/email: null/.test(site)) pending.push('E-mail profissional (site.ts → email)')
if (/linkedin: null/.test(site)) pending.push('LinkedIn (site.ts → socials.linkedin)')
if (/portrait: null/.test(site)) pending.push('Retrato opcional (site.ts → portrait)')
if (/showPlaceholders: true/.test(site)) pending.push('showPlaceholders ainda está true (exemplos visíveis no site)')
const placeholders = files.reduce((n, f) => n + (readFileSync(f, 'utf8').match(/placeholder: true/g)?.length ?? 0), 0)
if (placeholders) pending.push(`${placeholders} item(ns) com placeholder: true`)

console.log(`\n${total} marcação(ões) [A PREENCHER] nos arquivos de conteúdo.`)
if (pending.length) console.log('\nConfigurações pendentes:\n- ' + pending.join('\n- '))
else console.log('\nNenhuma configuração pendente. ✶')
