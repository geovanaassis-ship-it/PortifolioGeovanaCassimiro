import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { del, list, put } from '@vercel/blob'

/**
 * Armazenamento das imagens e dos dados (galeria e projetos).
 * - Na Vercel (BLOB_READ_WRITE_TOKEN definido): Vercel Blob.
 * - No computador (npm run dev, sem o token): arquivos em public/dev-uploads/ e .dev-data/.
 *
 * Os dados (galeria e projetos) são salvos como um arquivo novo a cada alteração
 * (<pasta>/dados-<sufixo>.json) e lidos pelo mais recente. Assim nunca se lê uma
 * versão antiga guardada em cache, e as últimas versões ficam como cópia de segurança.
 */
export type DataKind = 'galeria' | 'projetos'
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)
const KEEP_VERSIONS = 10

const LOCAL_FILES = 'public/dev-uploads'
const localData = (kind: DataKind) => `.dev-data/${kind}.json`

export async function saveFile(path: string, body: Blob, contentType: string): Promise<string> {
  if (useBlob()) {
    const blob = await put(path, body, { access: 'public', addRandomSuffix: true, contentType, cacheControlMaxAge: 60 * 60 * 24 * 365 })
    return blob.url
  }
  const name = path.replace(/(\.[a-z0-9]+)$/i, `-${randomBytes(4).toString('hex')}$1`)
  const file = join(LOCAL_FILES, name)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, Buffer.from(await body.arrayBuffer()))
  return `/dev-uploads/${name}`
}

/** Apaga arquivos enviados pelo admin. Fotos que vêm do próprio site (/images/...) são ignoradas. */
export async function deleteFiles(urls: string[]) {
  if (useBlob()) {
    const blobs = urls.filter((u) => u.startsWith('https://') && u.includes('.blob.vercel-storage.com/'))
    if (blobs.length) await del(blobs)
    return
  }
  for (const u of urls.filter((u) => u.startsWith('/dev-uploads/'))) await rm(join('public', u), { force: true })
}

export async function readData<T>(kind: DataKind): Promise<T | null> {
  if (useBlob()) {
    const latest = (await dataVersions(kind))[0]
    if (!latest) return null
    const res = await fetch(latest.url, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Não foi possível ler os dados (${kind}, ${res.status}).`)
    return (await res.json()) as T
  }
  try {
    return JSON.parse(await readFile(localData(kind), 'utf8')) as T
  } catch {
    return null
  }
}

export async function writeData(kind: DataKind, data: unknown) {
  const json = JSON.stringify(data)
  if (useBlob()) {
    await put(`${kind}/dados.json`, json, { access: 'public', addRandomSuffix: true, contentType: 'application/json', cacheControlMaxAge: 60 })
    const old = (await dataVersions(kind)).slice(KEEP_VERSIONS)
    if (old.length) await del(old.map((b) => b.url))
    return
  }
  await mkdir(dirname(localData(kind)), { recursive: true })
  await writeFile(localData(kind), json)
}

/** Versões salvas dos dados, da mais nova para a mais antiga. */
async function dataVersions(kind: DataKind) {
  const { blobs } = await list({ prefix: `${kind}/dados`, limit: 1000 })
  return blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
}
