import { useCallback, useMemo, useState } from 'react'
import { PinGrid } from '../components/gallery/PinGrid'
import { VideoEmbed } from '../components/gallery/VideoEmbed'
import { FilterBar } from '../components/ui/FilterBar'
import { PlaceholderBadge } from '../components/ui/Placeholder'
import { Seo } from '../components/ui/Seo'
import { StarSticker } from '../components/ui/StarSticker'
import { SectionLabel, TextLinkExternal } from '../components/ui/bits'
import { visibleSeries } from '../lib/content'
import { useGallery } from '../lib/gallery'

export function Photography() {
  const { gallery, error } = useGallery()
  const [filter, setFilter] = useState('all')

  const niches = useMemo(() => {
    if (!gallery) return []
    const used = new Set(gallery.photos.map((p) => p.niche))
    return gallery.niches.filter((n) => used.has(n.id))
  }, [gallery])
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const p of gallery?.photos ?? []) c[p.niche] = (c[p.niche] ?? 0) + 1
    return c
  }, [gallery])
  const nicheLabel = useCallback((id: string) => gallery?.niches.find((n) => n.id === id)?.label ?? '', [gallery])

  const active = niches.find((n) => n.id === filter)
  const shown = useMemo(
    () => (gallery ? (active ? gallery.photos.filter((p) => p.niche === active.id) : gallery.photos) : []),
    [gallery, active],
  )
  const videos = visibleSeries.filter((s) => s.videos?.length || s.links?.length)

  return (
    <div className="on-dark -mb-24 bg-ink pb-24 text-beige">
      <Seo title="Fotografia e audiovisual" description="Fotografia e produção audiovisual de Geovana Cassimiro: eventos, fotografia publicitária, retratos e vídeo." />

      <header className="container-page relative py-14 md:py-20">
        <StarSticker size={150} color="var(--color-midnight)" accent="var(--color-moss)" rotate={-12} className="absolute right-4 top-10 hidden md:block" />
        <SectionLabel code="#04" className="text-rosy">Imagem</SectionLabel>
        <h1 className="mt-5 text-[clamp(2.6rem,7vw,5.2rem)] font-medium">
          Fotografia <span className="italic text-rosy">e audiovisual</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-beige/80">
          Fotografia é onde treino o olhar — luz, enquadramento, ritmo. Filtre por nicho e clique em uma foto para ampliar.
        </p>
      </header>

      <div className="container-page">
        {niches.length > 1 && (
          <div className="sticky top-[4.5rem] z-20 -mx-5 mb-8 bg-ink/95 px-5 py-3 backdrop-blur md:-mx-10 md:px-10">
            <FilterBar categories={niches} value={active ? filter : 'all'} onChange={setFilter} label="Filtrar fotos por nicho" tone="dark" counts={counts} />
          </div>
        )}

        {active?.description && <p className="mb-8 max-w-2xl text-beige/80">{active.description}</p>}

        {!gallery && !error && <p className="label-mono py-14 text-center text-beige/60">Carregando fotos…</p>}
        {(error || (gallery && shown.length === 0)) && (
          <p className="rounded-[var(--radius-swatch)] border border-dashed border-beige/30 px-6 py-14 text-center text-beige/70">
            As fotos estão sendo selecionadas e chegam em breve.
          </p>
        )}
        {shown.length > 0 && <PinGrid key={filter} photos={shown} nicheLabel={nicheLabel} />}

        {videos.length > 0 && (
          <div className="mt-24 space-y-24">
            {videos.map((s) => (
              <section key={s.slug} aria-labelledby={`${s.slug}-titulo`} className="border-t border-beige/15 pt-6">
                <div className="mb-8 grid gap-4 md:grid-cols-[1fr_1.2fr] md:gap-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="label-mono text-moss">
                        Audiovisual{s.year && ` · ${s.year}`}
                      </p>
                      {s.placeholder && <PlaceholderBadge />}
                    </div>
                    <h2 id={`${s.slug}-titulo`} className="mt-2 text-[clamp(1.9rem,4vw,2.8rem)] font-medium">
                      {s.title}
                    </h2>
                  </div>
                  <div className="md:pt-6">
                    {s.description && <p className="text-beige/80">{s.description}</p>}
                    {s.links?.length ? (
                      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                        {s.links.map((l) => (
                          <li key={l.url}>
                            <TextLinkExternal href={l.url} className="text-butter">{l.label}</TextLinkExternal>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
                {s.videos?.length ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {s.videos.map((v, i) => <VideoEmbed key={`${v.source}-${i}`} video={v} />)}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
