import type { ReactNode } from 'react'
import { Icon } from '../../components/ui/Icon'
import { photoDate, resizePhoto } from '../../lib/image-resize'

/** Peças comuns da área de admin (galeria e projetos). */

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' | 'ok' }) {
  const color = tone === 'error' ? 'border-cherry/40 bg-cherry/5 text-cherry' : tone === 'ok' ? 'border-moss/50 bg-moss/10 text-ink' : 'border-ink/20 bg-beige text-ink/80'
  return <div className={`rounded-xl border px-5 py-4 ${color}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>
}


export const field = 'w-full rounded-lg border-[1.5px] border-ink/20 bg-white/70 px-3 py-2 text-ink focus:border-ink focus:outline-none'

export function IconButton({ label, icon, onClick, disabled, rotate }: { label: string; icon: 'chevronLeft' | 'chevronRight' | 'arrowLeft' | 'arrowRight' | 'close' | 'check'; onClick: () => void; disabled?: boolean; rotate?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-ink/20 hover:border-ink disabled:opacity-30 disabled:hover:border-ink/20"
    >
      <span className={rotate ? 'rotate-90' : ''}>
        <Icon name={icon} size={18} />
      </span>
    </button>
  )
}

export interface UploadedImage {
  id: string
  src: string
  thumb: string
  width: number
  height: number
  /** Data em que a foto foi tirada (AAAA-MM-DD). */
  date: string
}

/** Reduz a imagem no navegador e envia (POST /api/photos). */
export async function uploadImage(file: File, group: 'galeria' | 'projetos', folder: string): Promise<UploadedImage> {
  const [resized, date] = await Promise.all([resizePhoto(file), photoDate(file)])
  const form = new FormData()
  form.append('full', resized.full, 'full')
  form.append('thumb', resized.thumb, 'thumb')
  form.append('group', group)
  form.append('niche', folder)
  const r = await fetch('/api/photos', { method: 'POST', body: form })
  const body = (await r.json().catch(() => ({}))) as { id?: string; src?: string; thumb?: string; error?: string }
  if (r.status === 401) throw new Error('Sua sessão expirou. Entre de novo.')
  if (!r.ok || !body.id || !body.src || !body.thumb) throw new Error(body.error ?? `Erro ${r.status}`)
  return { id: body.id, src: body.src, thumb: body.thumb, width: resized.width, height: resized.height, date }
}

/** Salva os dados (PUT). Devolve a mensagem de erro, ou null se deu certo. */
export async function saveJson(url: string, data: unknown): Promise<string | null> {
  const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(() => null)
  if (r?.status === 401) return 'Sua sessão expirou. Entre de novo (as alterações não salvas serão perdidas).'
  if (!r?.ok) return ((await r?.json().catch(() => null)) as { error?: string } | null)?.error ?? 'Não foi possível salvar. Verifique a conexão e tente de novo.'
  return null
}
