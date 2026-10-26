import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Seo } from '../components/ui/Seo'
import { formatDate, loadGallery } from '../lib/gallery'
import { slugify, type Gallery, type GalleryNiche, type GalleryPhoto } from '../lib/gallery-types'
import { photoDate, resizePhoto } from '../lib/image-resize'

/**
 * ÁREA DE ADMIN (/abc)
 * Envio e organização das fotos da galeria. Protegida pela senha ADMIN_PASSWORD
 * (configurada na Vercel). Não aparece no menu nem nos buscadores.
 */
type Session = 'loading' | 'out' | 'in' | 'unconfigured' | 'offline'

export function Admin() {
  const [session, setSession] = useState<Session>('loading')

  useEffect(() => {
    fetch('/api/login', { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok || !r.headers.get('content-type')?.includes('json')) return setSession('offline')
        const { authed, configured } = (await r.json()) as { authed: boolean; configured: boolean }
        setSession(!configured ? 'unconfigured' : authed ? 'in' : 'out')
      })
      .catch(() => setSession('offline'))
  }, [])

  return (
    <div className="container-page py-12 md:py-16">
      <Seo title="Admin" noindex />
      <p className="label-mono text-olive">Área restrita</p>
      <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-medium">
        Galeria <span className="italic text-cherry">— admin</span>
      </h1>

      <div className="mt-10">
        {session === 'loading' && <p className="label-mono text-ink/60">Carregando…</p>}
        {session === 'offline' && (
          <Notice>
            As funções do servidor não estão disponíveis aqui. A área de admin funciona no site publicado na Vercel ou com <code>npm run dev</code>.
          </Notice>
        )}
        {session === 'unconfigured' && (
          <Notice>
            A senha de admin ainda não foi configurada. Na Vercel, crie a variável de ambiente <code>ADMIN_PASSWORD</code> e publique o site de novo.
          </Notice>
        )}
        {session === 'out' && <Login onDone={() => setSession('in')} />}
        {session === 'in' && <Panel onLogout={() => setSession('out')} />}
      </div>
    </div>
  )
}

function Notice({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'error' | 'ok' }) {
  const color = tone === 'error' ? 'border-cherry/40 bg-cherry/5 text-cherry' : tone === 'ok' ? 'border-moss/50 bg-moss/10 text-ink' : 'border-ink/20 bg-beige text-ink/80'
  return <div className={`rounded-xl border px-5 py-4 ${color}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>
}

const field = 'w-full rounded-lg border-[1.5px] border-ink/20 bg-white/70 px-3 py-2 text-ink focus:border-ink focus:outline-none'

/* ---------- Login ---------- */

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }).catch(() => null)
    setBusy(false)
    if (r?.ok) return onDone()
    setError(((await r?.json().catch(() => null)) as { error?: string } | null)?.error ?? 'Não foi possível entrar.')
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4">
      <label className="block">
        <span className="label-mono text-ink/70">Senha</span>
        <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`${field} mt-2`} />
      </label>
      {error && <Notice tone="error">{error}</Notice>}
      <Button type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</Button>
    </form>
  )
}

/* ---------- Painel ---------- */

interface QueueItem {
  name: string
  status: 'waiting' | 'working' | 'done' | 'error'
  message?: string
}

function Panel({ onLogout }: { onLogout: () => void }) {
  const [saved, setSaved] = useState<Gallery | null>(null)
  const [draft, setDraft] = useState<Gallery | null>(null)
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadGallery().then((g) => {
      setSaved(g)
      setDraft(g)
    })
  }, [])

  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  async function save(next: Gallery) {
    setSaving(true)
    const r = await fetch('/api/gallery', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) }).catch(() => null)
    setSaving(false)
    if (r?.status === 401) {
      setMessage({ tone: 'error', text: 'Sua sessão expirou. Entre de novo (as alterações não salvas serão perdidas).' })
      return false
    }
    if (!r?.ok) {
      const err = ((await r?.json().catch(() => null)) as { error?: string } | null)?.error
      setMessage({ tone: 'error', text: err ?? 'Não foi possível salvar. Verifique a conexão e tente de novo.' })
      return false
    }
    setSaved(next)
    setDraft(next)
    setMessage({ tone: 'ok', text: 'Galeria salva. As mudanças já aparecem no site.' })
    return true
  }

  async function logout() {
    if (dirty && !confirm('Há alterações não salvas. Sair mesmo assim?')) return
    await fetch('/api/login', { method: 'DELETE' }).catch(() => null)
    onLogout()
  }

  if (!draft) return <p className="label-mono text-ink/60">Carregando galeria…</p>

  return (
    <div className="space-y-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-ink/70">
          {draft.photos.length} foto(s) em {draft.niches.length} nicho(s). <a href="/fotografia" target="_blank" rel="noopener" className="underline">Ver galeria no site</a>
        </p>
        <Button variant="outline" onClick={logout}>Sair</Button>
      </div>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      <Upload gallery={draft} onUploaded={(next) => save(next)} setGallery={setDraft} />
      <Niches gallery={draft} setGallery={setDraft} />
      <Photos gallery={draft} setGallery={setDraft} />

      {dirty && (
        <div className="sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-4 text-beige shadow-xl">
          <span>Você tem alterações não salvas.</span>
          <div className="flex gap-3">
            <Button variant="light" onClick={() => setDraft(saved)} disabled={saving}>Descartar</Button>
            <Button variant="accent" onClick={() => save(draft)} disabled={saving}>{saving ? 'Salvando…' : 'Salvar alterações'}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Envio ---------- */

function Upload({ gallery, setGallery, onUploaded }: { gallery: Gallery; setGallery: (g: Gallery) => void; onUploaded: (g: Gallery) => Promise<boolean> }) {
  const [niche, setNiche] = useState(gallery.niches[0]?.id ?? '')
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [dragging, setDragging] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const busy = queue.some((q) => q.status === 'waiting' || q.status === 'working')

  async function send(files: File[]) {
    const images = files.filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name))
    if (!images.length || !niche) return
    setQueue(images.map((f) => ({ name: f.name, status: 'waiting' })))
    const added: GalleryPhoto[] = []
    const update = (i: number, item: Partial<QueueItem>) => setQueue((q) => q.map((x, j) => (j === i ? { ...x, ...item } : x)))

    for (const [i, file] of images.entries()) {
      update(i, { status: 'working' })
      try {
        const [resized, date] = await Promise.all([resizePhoto(file), photoDate(file)])
        const form = new FormData()
        form.append('full', resized.full, 'full')
        form.append('thumb', resized.thumb, 'thumb')
        form.append('niche', niche)
        const r = await fetch('/api/photos', { method: 'POST', body: form })
        const body = (await r.json().catch(() => ({}))) as { id?: string; src?: string; thumb?: string; error?: string }
        if (!r.ok || !body.src || !body.thumb) throw new Error(body.error ?? `Erro ${r.status}`)
        added.push({ id: body.id!, src: body.src, thumb: body.thumb, width: resized.width, height: resized.height, niche, date })
        update(i, { status: 'done' })
      } catch (err) {
        update(i, { status: 'error', message: (err as Error).message })
      }
    }
    if (added.length) {
      // Fotos novas entram no começo do nicho escolhido.
      const firstOfNiche = gallery.photos.findIndex((p) => p.niche === niche)
      const at = firstOfNiche === -1 ? 0 : firstOfNiche
      const photos = [...gallery.photos.slice(0, at), ...added, ...gallery.photos.slice(at)]
      const next = { ...gallery, photos }
      setGallery(next)
      await onUploaded(next)
    }
  }

  return (
    <section aria-labelledby="enviar">
      <h2 id="enviar" className="font-display text-3xl font-medium">Enviar fotos</h2>
      {gallery.niches.length === 0 ? (
        <p className="mt-3 text-ink/70">Crie um nicho primeiro (logo abaixo) para poder enviar fotos.</p>
      ) : (
        <>
          <label className="mt-5 block max-w-sm">
            <span className="label-mono text-ink/70">Nicho das fotos</span>
            <select value={niche} onChange={(e) => setNiche(e.target.value)} className={`${field} mt-2`} disabled={busy}>
              {gallery.niches.map((n) => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              if (!busy) send([...e.dataTransfer.files])
            }}
            className={`mt-5 grid place-items-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${dragging ? 'border-cherry bg-rosy/20' : 'border-ink/25 bg-beige/60'}`}
          >
            <Icon name="camera" size={28} />
            <p className="mt-3 font-medium">Arraste as fotos aqui</p>
            <p className="mt-1 text-sm text-ink/60">ou</p>
            <Button className="mt-3" onClick={() => input.current?.click()} disabled={busy}>Escolher fotos</Button>
            <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => (send([...(e.target.files ?? [])]), (e.target.value = ''))} />
            <p className="mt-4 max-w-md text-xs text-ink/60">
              Pode mandar no tamanho original: o navegador reduz cada foto antes de enviar. A data é lida da própria foto e pode ser ajustada depois.
            </p>
          </div>

          {queue.length > 0 && (
            <ul className="mt-5 space-y-1 text-sm" aria-live="polite">
              {queue.map((q, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-5 text-center">{q.status === 'done' ? '✓' : q.status === 'error' ? '✗' : q.status === 'working' ? '…' : '·'}</span>
                  <span className={q.status === 'error' ? 'text-cherry' : q.status === 'done' ? 'text-ink' : 'text-ink/60'}>
                    {q.name}
                    {q.message && ` — ${q.message}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

/* ---------- Nichos ---------- */

function Niches({ gallery, setGallery }: { gallery: Gallery; setGallery: (g: Gallery) => void }) {
  const [label, setLabel] = useState('')
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const p of gallery.photos) c[p.niche] = (c[p.niche] ?? 0) + 1
    return c
  }, [gallery.photos])

  const edit = (id: string, patch: Partial<GalleryNiche>) =>
    setGallery({ ...gallery, niches: gallery.niches.map((n) => (n.id === id ? { ...n, ...patch } : n)) })

  function add(e: FormEvent) {
    e.preventDefault()
    const base = slugify(label)
    if (!base) return
    let id = base
    for (let i = 2; gallery.niches.some((n) => n.id === id); i++) id = `${base}-${i}`
    setGallery({ ...gallery, niches: [...gallery.niches, { id, label: label.trim() }] })
    setLabel('')
  }

  function move(i: number, delta: number) {
    const niches = [...gallery.niches]
    const j = i + delta
    if (j < 0 || j >= niches.length) return
    ;[niches[i], niches[j]] = [niches[j], niches[i]]
    setGallery({ ...gallery, niches })
  }

  return (
    <section aria-labelledby="nichos">
      <h2 id="nichos" className="font-display text-3xl font-medium">Nichos</h2>
      <p className="mt-2 text-ink/70">São os filtros da galeria, na ordem desta lista. Nichos sem fotos não aparecem no site.</p>

      <ul className="mt-5 space-y-3">
        {gallery.niches.map((n, i) => (
          <li key={n.id} className="grid gap-3 rounded-xl border border-ink/15 p-4 md:grid-cols-[1fr_1.5fr_auto] md:items-start">
            <label>
              <span className="label-mono text-ink/60">Nome ({counts[n.id] ?? 0} fotos)</span>
              <input value={n.label} onChange={(e) => edit(n.id, { label: e.target.value })} className={`${field} mt-1`} maxLength={80} />
            </label>
            <label>
              <span className="label-mono text-ink/60">Descrição (opcional)</span>
              <textarea value={n.description ?? ''} onChange={(e) => edit(n.id, { description: e.target.value || undefined })} rows={2} className={`${field} mt-1`} maxLength={1000} />
            </label>
            <div className="flex gap-2 md:pt-6">
              <IconButton label="Subir" icon="chevronLeft" rotate onClick={() => move(i, -1)} disabled={i === 0} />
              <IconButton label="Descer" icon="chevronRight" rotate onClick={() => move(i, 1)} disabled={i === gallery.niches.length - 1} />
              <IconButton
                label={counts[n.id] ? 'Mova ou apague as fotos deste nicho antes de excluí-lo' : 'Excluir nicho'}
                icon="close"
                onClick={() => setGallery({ ...gallery, niches: gallery.niches.filter((x) => x.id !== n.id) })}
                disabled={Boolean(counts[n.id])}
              />
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="mt-4 flex max-w-lg gap-3">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Novo nicho, ex.: Retratos" className={field} maxLength={80} />
        <Button type="submit" variant="outline" disabled={!slugify(label)}>Adicionar</Button>
      </form>
    </section>
  )
}

/* ---------- Fotos ---------- */

function Photos({ gallery, setGallery }: { gallery: Gallery; setGallery: (g: Gallery) => void }) {
  const [filter, setFilter] = useState('all')
  const shown = gallery.photos.filter((p) => filter === 'all' || p.niche === filter)
  const label = (id: string) => gallery.niches.find((n) => n.id === id)?.label ?? id

  const edit = (id: string, patch: Partial<GalleryPhoto>) =>
    setGallery({ ...gallery, photos: gallery.photos.map((p) => (p.id === id ? { ...p, ...patch } : p)) })

  /** Troca de lugar com a foto vizinha dentro da lista exibida. */
  function move(id: string, delta: number) {
    const k = shown.findIndex((p) => p.id === id)
    const other = shown[k + delta]
    if (!other) return
    const photos = [...gallery.photos]
    const a = photos.findIndex((p) => p.id === id)
    const b = photos.findIndex((p) => p.id === other.id)
    ;[photos[a], photos[b]] = [photos[b], photos[a]]
    setGallery({ ...gallery, photos })
  }

  return (
    <section aria-labelledby="fotos">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="fotos" className="font-display text-3xl font-medium">Fotos</h2>
          <p className="mt-2 text-ink/70">O nome e a data aparecem ao passar o mouse sobre a foto no site. A ordem aqui é a ordem da galeria.</p>
        </div>
        <label className="w-56">
          <span className="label-mono text-ink/60">Mostrar</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${field} mt-1`}>
            <option value="all">Todos os nichos</option>
            {gallery.niches.map((n) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </label>
      </div>

      {shown.length === 0 && <p className="mt-6 text-ink/60">Nenhuma foto aqui ainda.</p>}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <li key={p.id} className="overflow-hidden rounded-xl border border-ink/15 bg-white/50">
            <img src={p.thumb} alt="" width={p.width} height={p.height} loading="lazy" className="aspect-[4/3] w-full bg-beige object-cover" />
            <div className="space-y-2 p-3">
              <input value={p.title ?? ''} onChange={(e) => edit(p.id, { title: e.target.value || undefined })} placeholder={`Nome (opcional) — senão: ${label(p.niche)}`} className={field} maxLength={200} aria-label="Nome da foto" />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={p.date ?? ''} onChange={(e) => edit(p.id, { date: e.target.value || undefined })} className={field} aria-label="Data da foto" />
                <select value={p.niche} onChange={(e) => edit(p.id, { niche: e.target.value })} className={field} aria-label="Nicho da foto">
                  {gallery.niches.map((n) => (
                    <option key={n.id} value={n.id}>{n.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="label-mono text-[0.65rem] text-ink/50">{formatDate(p.date) || 'sem data'}</span>
                <div className="flex gap-2">
                  <IconButton label="Mover para antes" icon="arrowLeft" onClick={() => move(p.id, -1)} disabled={i === 0} />
                  <IconButton label="Mover para depois" icon="arrowRight" onClick={() => move(p.id, 1)} disabled={i === shown.length - 1} />
                  <IconButton
                    label="Apagar foto"
                    icon="close"
                    onClick={() => confirm('Apagar esta foto da galeria? Depois de salvar, não dá para desfazer.') && setGallery({ ...gallery, photos: gallery.photos.filter((x) => x.id !== p.id) })}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function IconButton({ label, icon, onClick, disabled, rotate }: { label: string; icon: 'chevronLeft' | 'chevronRight' | 'arrowLeft' | 'arrowRight' | 'close'; onClick: () => void; disabled?: boolean; rotate?: boolean }) {
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
