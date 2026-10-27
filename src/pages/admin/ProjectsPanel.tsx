import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { sections } from '../../content/site'
import { isVideo, type ExternalLinkItem, type GalleryItem, type MediaImage, type MediaVideo, type SectionId } from '../../content/types'
import { slugify } from '../../lib/gallery-types'
import { loadProjectsData } from '../../lib/projects'
import { SECTION_IDS, type ProjectsData, type StoredProject } from '../../lib/projects-data'
import { IconButton, Notice, field, saveJson, uploadImage } from './shared'

/**
 * PROJETOS (área de admin): trabalhos das abas More Invest, CACO, Portal C360 e Outros.
 * Cada projeto é salvo na hora (PUT /api/projects com a lista inteira).
 */
type Message = { tone: 'ok' | 'error'; text: string } | null

export function ProjectsPanel({ onLogout }: { onLogout: () => void }) {
  const [data, setData] = useState<ProjectsData | null>(null)
  const [section, setSection] = useState<SectionId>('more-invest')
  const [editing, setEditing] = useState<{ project: StoredProject; isNew: boolean } | null>(null)
  const [message, setMessage] = useState<Message>(null)
  const [saving, setSaving] = useState(false)
  const top = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadProjectsData().then(setData)
  }, [])

  async function persist(projects: StoredProject[], ok: string) {
    setSaving(true)
    const error = await saveJson('/api/projects', { projects })
    setSaving(false)
    if (error) {
      setMessage({ tone: 'error', text: error })
      return false
    }
    setData({ projects })
    setMessage({ tone: 'ok', text: ok })
    return true
  }

  async function logout() {
    if (editing && !confirm('Há um projeto aberto para edição. Sair mesmo assim?')) return
    await fetch('/api/login', { method: 'DELETE' }).catch(() => null)
    onLogout()
  }

  if (!data) return <p className="label-mono text-ink/60">Carregando projetos…</p>

  const list = data.projects.filter((p) => p.section === section)

  function open(project: StoredProject, isNew: boolean) {
    setEditing({ project, isNew })
    setMessage(null)
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  async function saveProject(project: StoredProject, originalSlug: string | null) {
    const others = data!.projects
    const projects =
      originalSlug === null
        ? (() => {
            // Projeto novo entra no começo da sua aba.
            const at = others.findIndex((p) => p.section === project.section)
            return at === -1 ? [...others, project] : [...others.slice(0, at), project, ...others.slice(at)]
          })()
        : others.map((p) => (p.section === project.section && p.slug === originalSlug ? project : p))
    if (await persist(projects, `"${project.title}" salvo. Já aparece no site.`)) setEditing(null)
  }

  function remove(p: StoredProject) {
    if (!confirm(`Apagar "${p.title}"? Ele sai do site e as imagens dele são apagadas. Não dá para desfazer.`)) return
    persist(
      data!.projects.filter((x) => x !== p),
      `"${p.title}" apagado.`,
    )
  }

  function move(p: StoredProject, delta: number) {
    const k = list.indexOf(p)
    const other = list[k + delta]
    if (!other) return
    const projects = [...data!.projects]
    const a = projects.indexOf(p)
    const b = projects.indexOf(other)
    ;[projects[a], projects[b]] = [projects[b], projects[a]]
    persist(projects, 'Ordem salva.')
  }

  return (
    <div className="space-y-10" ref={top}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-ink/70">
          {data.projects.length} projeto(s) no site. Cada projeto é salvo na hora, ao clicar em <strong>Salvar projeto</strong>.
        </p>
        <Button variant="outline" onClick={logout}>Sair</Button>
      </div>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      {editing ? (
        <ProjectEditor
          key={`${editing.project.section}/${editing.project.slug}`}
          initial={editing.project}
          isNew={editing.isNew}
          taken={data.projects.filter((p) => p.section === editing.project.section && !(p === editing.project)).map((p) => p.slug)}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSave={(p) => saveProject(p, editing.isNew ? null : editing.project.slug)}
        />
      ) : (
        <>
          <div role="tablist" aria-label="Abas do site" className="flex flex-wrap gap-2">
            {SECTION_IDS.map((id) => {
              const count = data.projects.filter((p) => p.section === id).length
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={section === id}
                  onClick={() => setSection(id)}
                  className={`rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold ${section === id ? 'border-ink bg-ink text-oat' : 'border-ink/25 hover:border-ink'}`}
                >
                  {sections[id].label} <span className="font-mono text-xs opacity-60">{count}</span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-medium">{sections[section].label}</h2>
            <Button onClick={() => open(emptyProject(section), true)} iconLeft="check" disabled={saving}>
              Novo projeto
            </Button>
          </div>

          {list.length === 0 ? (
            <p className="rounded-xl border border-dashed border-ink/25 px-6 py-10 text-center text-ink/60">
              Nenhum projeto nesta aba ainda. Clique em <strong>Novo projeto</strong> para começar.
            </p>
          ) : (
            <ul className="space-y-3">
              {list.map((p, i) => (
                <li key={p.slug} className="flex flex-wrap items-center gap-4 rounded-xl border border-ink/15 bg-white/50 p-3">
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-beige">
                    {p.cover && <img src={p.cover.thumb ?? p.cover.src} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {p.title} {p.featured && <span className="label-mono ml-1 rounded-full bg-butter px-2 py-0.5 text-[0.6rem]">Destaque</span>}
                    </p>
                    <p className="truncate text-sm text-ink/60">
                      {[sections[section].categories.find((c) => c.id === p.category)?.label, p.year].filter(Boolean).join(' · ')} — {p.summary}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => open(p, false)} disabled={saving}>Editar</Button>
                    <IconButton label="Mover para cima" icon="chevronLeft" rotate onClick={() => move(p, -1)} disabled={saving || i === 0} />
                    <IconButton label="Mover para baixo" icon="chevronRight" rotate onClick={() => move(p, 1)} disabled={saving || i === list.length - 1} />
                    <IconButton label="Apagar projeto" icon="close" onClick={() => remove(p)} disabled={saving} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

const emptyProject = (section: SectionId): StoredProject => ({
  section,
  slug: '',
  title: '',
  category: sections[section].categories[0].id,
  summary: '',
})

/* ---------- Formulário ---------- */

/** Versão "de formulário" do projeto: listas viram texto, campos vazios viram ''. */
interface Form {
  title: string
  category: string
  year: string
  summary: string
  role: string
  responsibilities: string
  context: string
  objective: string
  challenge: string
  strategy: string
  process: string
  result: string
  resultSource: string
  tools: string
  deliverables: string
  featured: boolean
  cover: MediaImage | undefined
  gallery: GalleryItem[]
  links: ExternalLinkItem[]
}

const toForm = (p: StoredProject): Form => ({
  title: p.title,
  category: p.category,
  year: p.year ?? '',
  summary: p.summary,
  role: p.role ?? '',
  responsibilities: (p.responsibilities ?? []).join('\n'),
  context: p.context ?? '',
  objective: p.objective ?? '',
  challenge: p.challenge ?? '',
  strategy: p.strategy ?? '',
  process: p.process ?? '',
  result: p.result?.text ?? '',
  resultSource: p.result?.source ?? '',
  tools: (p.tools ?? []).join(', '),
  deliverables: (p.deliverables ?? []).join(', '),
  featured: Boolean(p.featured),
  cover: p.cover,
  gallery: p.gallery ?? [],
  links: p.links ?? [],
})

const opt = (s: string) => s.trim() || undefined
const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean)
const commas = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean)
const optList = (l: string[]) => (l.length ? l : undefined)

function fromForm(f: Form, base: StoredProject, slug: string): StoredProject {
  const title = f.title.trim()
  let n = 0
  const gallery = f.gallery.map((g) => (isVideo(g) ? { ...g, title: g.title || title } : { ...g, alt: g.caption?.trim() || `${title} — imagem ${++n}` }))
  return {
    section: base.section,
    slug,
    title,
    category: f.category,
    summary: f.summary.trim(),
    year: opt(f.year),
    role: opt(f.role),
    responsibilities: optList(lines(f.responsibilities)),
    context: opt(f.context),
    objective: opt(f.objective),
    challenge: opt(f.challenge),
    strategy: opt(f.strategy),
    process: opt(f.process),
    result: f.result.trim() ? { text: f.result.trim(), source: opt(f.resultSource) } : undefined,
    tools: optList(commas(f.tools)),
    deliverables: optList(commas(f.deliverables)),
    featured: f.featured || undefined,
    featuredOrder: f.featured ? base.featuredOrder : undefined,
    cover: f.cover ? { ...f.cover, alt: title } : undefined,
    gallery: gallery.length ? gallery : undefined,
    links: f.links.length ? f.links.map((l) => ({ label: l.label.trim(), url: l.url.trim() })) : undefined,
  }
}

/** "https://youtu.be/abc" → vídeo do YouTube; "https://vimeo.com/123" → Vimeo. */
function parseVideo(url: string): MediaVideo | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return { kind: 'video', provider: 'youtube', source: yt[1], title: '' }
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return { kind: 'video', provider: 'vimeo', source: vm[1], title: '' }
  return null
}

function ProjectEditor({
  initial,
  isNew,
  taken,
  saving,
  onSave,
  onCancel,
}: {
  initial: StoredProject
  isNew: boolean
  taken: string[]
  saving: boolean
  onSave: (p: StoredProject) => void
  onCancel: () => void
}) {
  const [f, setF] = useState<Form>(() => toForm(initial))
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }))
  const meta = sections[initial.section]
  const folder = initial.section

  async function upload(files: File[], target: 'cover' | 'gallery') {
    const images = files.filter((file) => file.type.startsWith('image/') || /\.(heic|heif)$/i.test(file.name))
    if (!images.length) return
    setError('')
    for (const [i, file] of images.entries()) {
      setUploading(`Enviando ${i + 1} de ${images.length}…`)
      try {
        const up = await uploadImage(file, 'projetos', folder)
        const img: MediaImage = { src: up.src, thumb: up.thumb, width: up.width, height: up.height, alt: '' }
        if (target === 'cover') set('cover', img)
        else setF((x) => ({ ...x, gallery: [...x.gallery, img] }))
      } catch (err) {
        setError(`${file.name}: ${(err as Error).message}`)
      }
    }
    setUploading(null)
  }

  function addVideo() {
    const v = parseVideo(videoUrl)
    if (!v) return setError('Cole um link do YouTube ou do Vimeo.')
    setError('')
    setF((x) => ({ ...x, gallery: [...x.gallery, v] }))
    setVideoUrl('')
  }

  function moveItem(i: number, delta: number) {
    const g = [...f.gallery]
    const j = i + delta
    if (j < 0 || j >= g.length) return
    ;[g[i], g[j]] = [g[j], g[i]]
    set('gallery', g)
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!f.title.trim()) return setError('Dê um título ao projeto.')
    if (!f.summary.trim()) return setError('Escreva um resumo de uma ou duas frases.')
    const badLink = f.links.find((l) => !l.label.trim() || !/^https?:\/\//.test(l.url.trim()))
    if (badLink) return setError('Cada link precisa de um nome e de um endereço começando com https://')
    let slug = initial.slug
    if (isNew) {
      const base = slugify(f.title) || 'projeto'
      slug = base
      for (let n = 2; taken.includes(slug); n++) slug = `${base}-${n}`
    }
    onSave(fromForm(f, initial, slug))
  }

  const hasDetailContent = Boolean(
    f.context.trim() || f.objective.trim() || f.challenge.trim() || f.strategy.trim() || f.process.trim() || f.result.trim() || f.responsibilities.trim() || f.gallery.length,
  )

  return (
    <form onSubmit={submit} className="space-y-10 rounded-2xl border border-ink/15 bg-white/40 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl font-medium">
          {isNew ? 'Novo projeto' : 'Editar projeto'} <span className="italic text-ink/50">· {meta.label}</span>
        </h2>
        <Button variant="outline" onClick={onCancel} disabled={saving}>Cancelar</Button>
      </div>

      <Group title="O básico" hint="Aparece no card do projeto, na lista da aba.">
        <Text label="Título *" value={f.title} onChange={(v) => set('title', v)} max={200} />
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <label className="block">
            <span className="label-mono text-ink/60">Categoria *</span>
            <select value={f.category} onChange={(e) => set('category', e.target.value)} className={`${field} mt-1`}>
              {meta.categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
          <Text label="Ano" value={f.year} onChange={(v) => set('year', v)} max={20} placeholder="2025" />
        </div>
        <Text label="Resumo * (1–2 frases)" value={f.summary} onChange={(v) => set('summary', v)} rows={2} max={1000} />
        <Text label="Minha participação (uma linha)" value={f.role} onChange={(v) => set('role', v)} max={200} placeholder="Ex.: redação e direção de arte" />
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={f.featured} onChange={(e) => set('featured', e.target.checked)} className="h-5 w-5 accent-[var(--color-ink)]" />
          <span>Mostrar em <strong>Trabalhos em destaque</strong> na página inicial</span>
        </label>
      </Group>

      <Group title="Capa" hint="Imagem do card. Fica recortada em 4:3 — deixe o principal no centro.">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-32 w-44 place-items-center overflow-hidden rounded-xl bg-beige">
            {f.cover ? <img src={f.cover.thumb ?? f.cover.src} alt="" className="h-full w-full object-cover" /> : <Icon name="camera" size={24} />}
          </div>
          <div className="flex flex-wrap gap-2">
            <FileButton label={f.cover ? 'Trocar capa' : 'Escolher capa'} onFiles={(files) => upload(files.slice(0, 1), 'cover')} disabled={Boolean(uploading)} />
            {f.cover && <Button variant="outline" onClick={() => set('cover', undefined)}>Remover</Button>}
          </div>
        </div>
      </Group>

      <Group
        title="Página do projeto"
        hint="Opcional. Se preencher qualquer campo abaixo (ou adicionar imagens), o projeto ganha uma página própria. Sem isso, o card leva direto ao primeiro link."
      >
        <Text label="O que eu fiz (um item por linha)" value={f.responsibilities} onChange={(v) => set('responsibilities', v)} rows={4} max={5000} />
        <Text label="Contexto" value={f.context} onChange={(v) => set('context', v)} rows={4} max={10000} />
        <Text label="Objetivo" value={f.objective} onChange={(v) => set('objective', v)} rows={3} max={10000} />
        <Text label="Desafio" value={f.challenge} onChange={(v) => set('challenge', v)} rows={3} max={10000} />
        <Text label="Estratégia" value={f.strategy} onChange={(v) => set('strategy', v)} rows={4} max={10000} />
        <Text label="Processo" value={f.process} onChange={(v) => set('process', v)} rows={4} max={10000} />
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <Text label="Resultado (só dados comprovados)" value={f.result} onChange={(v) => set('result', v)} rows={2} max={2000} />
          <Text label="Fonte do resultado" value={f.resultSource} onChange={(v) => set('resultSource', v)} max={300} placeholder="Ex.: Instagram Insights" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Ferramentas (separadas por vírgula)" value={f.tools} onChange={(v) => set('tools', v)} max={2000} placeholder="Canva, CapCut" />
          <Text label="Entregáveis (separados por vírgula)" value={f.deliverables} onChange={(v) => set('deliverables', v)} max={2000} placeholder="Posts, Reels, apresentação" />
        </div>
        <p className="text-sm text-ink/60">Para separar parágrafos nos textos longos, deixe uma linha em branco entre eles.</p>
      </Group>

      <Group title="Imagens e vídeos" hint="Aparecem na página do projeto, na ordem abaixo. Pode mandar as imagens no tamanho original.">
        <div className="flex flex-wrap gap-2">
          <FileButton label="Adicionar imagens" multiple onFiles={(files) => upload(files, 'gallery')} disabled={Boolean(uploading)} />
        </div>
        <div className="flex max-w-xl gap-2">
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Link do YouTube ou Vimeo" className={field} />
          <Button variant="outline" onClick={addVideo} disabled={!videoUrl.trim()}>Adicionar vídeo</Button>
        </div>
        {f.gallery.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {f.gallery.map((g, i) => (
              <li key={isVideo(g) ? `v-${g.source}-${i}` : g.src} className="overflow-hidden rounded-xl border border-ink/15 bg-white/60">
                {isVideo(g) ? (
                  <div className="grid aspect-[4/3] place-items-center bg-ink text-beige">
                    <span className="label-mono">{g.provider === 'youtube' ? 'YouTube' : 'Vimeo'} · {g.source}</span>
                  </div>
                ) : (
                  <img src={g.thumb ?? g.src} alt="" className="aspect-[4/3] w-full bg-beige object-cover" />
                )}
                <div className="space-y-2 p-3">
                  {isVideo(g) ? (
                    <input value={g.title} onChange={(e) => set('gallery', f.gallery.map((x, j) => (j === i ? { ...g, title: e.target.value } : x)))} placeholder="Título do vídeo" className={field} aria-label="Título do vídeo" maxLength={200} />
                  ) : (
                    <input value={g.caption ?? ''} onChange={(e) => set('gallery', f.gallery.map((x, j) => (j === i ? { ...g, caption: e.target.value || undefined } : x)))} placeholder="Legenda (opcional)" className={field} aria-label="Legenda da imagem" maxLength={500} />
                  )}
                  <div className="flex justify-end gap-2">
                    <IconButton label="Mover para antes" icon="arrowLeft" onClick={() => moveItem(i, -1)} disabled={i === 0} />
                    <IconButton label="Mover para depois" icon="arrowRight" onClick={() => moveItem(i, 1)} disabled={i === f.gallery.length - 1} />
                    <IconButton label="Remover" icon="close" onClick={() => set('gallery', f.gallery.filter((_, j) => j !== i))} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Group>

      <Group title="Links" hint="Ex.: o post original no Instagram, a matéria no portal, o vídeo no YouTube.">
        {f.links.map((l, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <input value={l.label} onChange={(e) => set('links', f.links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} placeholder="Nome (ex.: Instagram)" className={field} aria-label="Nome do link" maxLength={80} />
            <input value={l.url} onChange={(e) => set('links', f.links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} placeholder="https://…" className={field} aria-label="Endereço do link" />
            <IconButton label="Remover link" icon="close" onClick={() => set('links', f.links.filter((_, j) => j !== i))} />
          </div>
        ))}
        {f.links.length < 10 && (
          <Button variant="outline" onClick={() => set('links', [...f.links, { label: '', url: '' }])}>Adicionar link</Button>
        )}
      </Group>

      {uploading && <Notice>{uploading}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      <div className="sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-4 text-beige shadow-xl">
        <span className="text-sm">
          {hasDetailContent ? 'Este projeto terá página própria.' : 'Sem página própria: o card mostra o resumo (e leva ao primeiro link, se houver).'}
        </span>
        <div className="flex gap-3">
          <Button variant="light" onClick={onCancel} disabled={saving}>Cancelar</Button>
          <Button type="submit" variant="accent" disabled={saving || Boolean(uploading)}>{saving ? 'Salvando…' : 'Salvar projeto'}</Button>
        </div>
      </div>
    </form>
  )
}

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-display text-2xl font-medium">{title}</legend>
      {hint && <p className="-mt-2 text-sm text-ink/60">{hint}</p>}
      {children}
    </fieldset>
  )
}

function Text({ label, value, onChange, rows, max, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; max: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="label-mono text-ink/60">{label}</span>
      {rows ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} maxLength={max} placeholder={placeholder} className={`${field} mt-1`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} maxLength={max} placeholder={placeholder} className={`${field} mt-1`} />
      )}
    </label>
  )
}

function FileButton({ label, onFiles, multiple, disabled }: { label: string; onFiles: (files: File[]) => void; multiple?: boolean; disabled?: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <>
      <Button onClick={() => input.current?.click()} disabled={disabled} iconLeft="camera">{label}</Button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(e) => {
          onFiles([...(e.target.files ?? [])])
          e.target.value = ''
        }}
      />
    </>
  )
}
