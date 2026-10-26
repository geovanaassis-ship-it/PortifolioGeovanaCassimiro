/**
 * Prepara as fotos da galeria.
 *
 * 1. Lê as fotos originais em fotos/<nome-do-ensaio>/ (jpg, png, webp, tiff, heic).
 * 2. Gera duas versões .webp em public/images/fotografia/<slug>/:
 *    - <slug>-NN.webp       (lado maior de 2000 px, usada ao ampliar)
 *    - <slug>-NN-thumb.webp (lado maior de 900 px, usada na grade)
 *    Os dados de localização (GPS) e da câmera são removidos.
 * 3. Apaga os originais de fotos/ (eles continuam no seu Drive/computador).
 * 4. Reescreve src/content/photo-gallery.json com a lista de fotos de cada ensaio,
 *    na ordem dos nomes de arquivo.
 *
 * Uso: npm run fotos
 */
import { readdir, mkdir, rm, writeFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import sharp from 'sharp'

const INPUT = 'fotos'
const OUTPUT = 'public/images/fotografia'
const MANIFEST = 'src/content/photo-gallery.json'
const FULL = 2000
const THUMB = 900
const INPUT_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.heic', '.heif'])

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const exists = (p) => stat(p).then(() => true, () => false)
const naturalSort = (a, b) => a.localeCompare(b, 'pt-BR', { numeric: true })

async function dirs(path) {
  if (!(await exists(path))) return []
  return (await readdir(path, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort(naturalSort)
}

/** Próximo número livre em public/images/fotografia/<slug>/ (fotos novas entram no fim). */
async function nextIndex(outDir, slug) {
  if (!(await exists(outDir))) return 1
  const nums = (await readdir(outDir))
    .map((f) => f.match(new RegExp(`^${slug}-(\\d+)\\.webp$`))?.[1])
    .filter(Boolean)
    .map(Number)
  return nums.length ? Math.max(...nums) + 1 : 1
}

let processed = 0
for (const folder of await dirs(INPUT)) {
  const slug = slugify(folder)
  if (!slug) continue
  const inDir = join(INPUT, folder)
  const outDir = join(OUTPUT, slug)
  await mkdir(outDir, { recursive: true })
  let n = await nextIndex(outDir, slug)

  const files = (await readdir(inDir)).filter((f) => INPUT_EXT.has(extname(f).toLowerCase())).sort(naturalSort)
  for (const file of files) {
    const name = `${slug}-${String(n).padStart(2, '0')}`
    const src = join(inDir, file)
    try {
      // rotate() aplica a orientação do celular/câmera antes de remover os metadados.
      const base = sharp(src, { failOn: 'none' }).rotate()
      await base.clone().resize(FULL, FULL, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(outDir, `${name}.webp`))
      await base.clone().resize(THUMB, THUMB, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 75 }).toFile(join(outDir, `${name}-thumb.webp`))
      await rm(src)
      console.log(`✓ ${folder}/${file} → ${outDir}/${name}.webp`)
      processed++
      n++
    } catch (err) {
      console.error(`✗ ${folder}/${file}: ${err.message}`)
      process.exitCode = 1
    }
  }
  if ((await readdir(inDir)).every((f) => f.startsWith('.'))) await rm(inDir, { recursive: true })
}

// Reconstrói a lista a partir do que existe de fato em public/images/fotografia/.
const manifest = {}
for (const slug of await dirs(OUTPUT)) {
  const outDir = join(OUTPUT, slug)
  const fulls = (await readdir(outDir)).filter((f) => f.endsWith('.webp') && !f.endsWith('-thumb.webp')).sort(naturalSort)
  const photos = []
  for (const f of fulls) {
    const { width, height } = await sharp(join(outDir, f)).metadata()
    const thumb = f.replace(/\.webp$/, '-thumb.webp')
    photos.push({
      src: `/images/fotografia/${slug}/${f}`,
      ...((await exists(join(outDir, thumb))) && { thumb: `/images/fotografia/${slug}/${thumb}` }),
      width,
      height,
    })
  }
  if (photos.length) manifest[slug] = photos
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

const total = Object.values(manifest).reduce((t, p) => t + p.length, 0)
console.log(`\n${processed} foto(s) nova(s) processada(s). Galeria: ${total} foto(s) em ${Object.keys(manifest).length} ensaio(s).`)
