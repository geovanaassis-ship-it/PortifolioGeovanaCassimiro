/**
 * Reduz a foto no navegador antes de enviar: uma versão grande (lado maior de 2000 px)
 * e uma miniatura (900 px), em WEBP (ou JPEG, se o navegador não gerar WEBP).
 * A orientação do celular/câmera é respeitada e os metadados (GPS etc.) não vão junto.
 */
export const FULL = 2000
export const THUMB = 900

export interface Resized {
  full: Blob
  thumb: Blob
  width: number
  height: number
}

export async function resizePhoto(file: File): Promise<Resized> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => {
    throw new Error('Formato não suportado por este navegador (fotos HEIC do iPhone: exporte como JPG).')
  })
  try {
    const big = await encode(bitmap, FULL, 0.82)
    const small = await encode(bitmap, THUMB, 0.78)
    return { full: big.blob, thumb: small.blob, width: big.width, height: big.height }
  } finally {
    bitmap.close()
  }
}

async function encode(bitmap: ImageBitmap, max: number, quality: number) {
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  const blob =
    (await toBlob(canvas, 'image/webp', quality)) ?? (await toBlob(canvas, 'image/jpeg', quality))
  if (!blob) throw new Error('Não foi possível processar a imagem.')
  return { blob, width, height }
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b && b.type === type ? b : null), type, quality))

/** Data em que a foto foi tirada (EXIF), no formato AAAA-MM-DD; senão, a data do arquivo. */
export async function photoDate(file: File): Promise<string> {
  try {
    // Na versão "lite" da biblioteca, pedir só alguns campos falha; lê-se tudo e pega a data.
    const { parse } = await import('exifr/dist/lite.esm.mjs')
    const data = (await parse(file)) as { DateTimeOriginal?: Date; CreateDate?: Date } | undefined
    const d = data?.DateTimeOriginal ?? data?.CreateDate
    if (d instanceof Date && !Number.isNaN(d.getTime())) return toIsoDate(d)
  } catch {
    /* sem EXIF */
  }
  return toIsoDate(new Date(file.lastModified))
}

const toIsoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
