import { useMemo, useState } from 'react'
import { MasonryGallery } from '../components/gallery/MasonryGallery'
import { VideoEmbed } from '../components/gallery/VideoEmbed'
import { FilterBar } from '../components/ui/FilterBar'
import { PlaceholderBadge } from '../components/ui/Placeholder'
import { Seo } from '../components/ui/Seo'
import { StarSticker } from '../components/ui/StarSticker'
import { SectionLabel, TextLinkExternal } from '../components/ui/bits'
import { photoCategories } from '../content/photography'
import { photoCategoryLabel, usedCategories, visibleSeries } from '../lib/content'

export function Photography() {
  const [filter, setFilter] = useState('all')
  const cats = useMemo(() => usedCategories(photoCategories, visibleSeries), [])
  const shown = filter === 'all' ? visibleSeries : visibleSeries.filter((s) => s.category === filter)

  return (
    <div className="on-dark -mb-24 bg-ink pb-24 text-beige">
      <Seo title="Fotografia e audiovisual" description="Fotografia e produção audiovisual de Geovana Cassimiro: eventos, retratos, editorial, marcas e vídeo." />

      <header className="container-page relative py-14 md:py-20">
        <StarSticker size={150} color="var(--color-midnight)" accent="var(--color-moss)" rotate={-12} className="absolute right-4 top-10 hidden md:block" />
        <SectionLabel code="#04" className="text-rosy">Imagem</SectionLabel>
        <h1 className="mt-5 text-[clamp(2.6rem,7vw,5.2rem)] font-medium">
          Fotografia <span className="italic text-rosy">e audiovisual</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-beige/80">
          Fotografia é onde treino o olhar — luz, enquadramento, ritmo. Aqui estão ensaios, registros de eventos e produções em vídeo. Clique em uma foto para ampliar.
        </p>
      </header>

      <div className="container-page">
        {cats.length > 1 && (
          <div className="sticky top-[4.5rem] z-20 -mx-5 mb-10 bg-ink/95 px-5 py-3 backdrop-blur md:-mx-10 md:px-10">
            <FilterBar categories={cats} value={filter} onChange={setFilter} label="Filtrar trabalhos por categoria" tone="dark" />
          </div>
        )}

        {shown.length === 0 && (
          <p className="rounded-[var(--radius-swatch)] border border-dashed border-beige/30 px-6 py-14 text-center text-beige/70">
            Os ensaios estão sendo selecionados e chegam em breve.
          </p>
        )}

        <div className="space-y-24">
          {shown.map((s) => (
            <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-titulo`} className="scroll-mt-40">
              <div className="mb-8 grid gap-4 border-t border-beige/15 pt-6 md:grid-cols-[1fr_1.2fr] md:gap-10">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="label-mono text-moss">
                      {photoCategoryLabel(s.category)}
                      {s.year && ` · ${s.year}`}
                    </p>
                    {s.placeholder && <PlaceholderBadge />}
                  </div>
                  <h2 id={`${s.slug}-titulo`} className="mt-2 text-[clamp(1.9rem,4vw,2.8rem)] font-medium">
                    {s.title}
                  </h2>
                  {s.client && <p className="mt-1 text-beige/70">{s.client}</p>}
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
                <div className="mb-6 grid gap-6 md:grid-cols-2">
                  {s.videos.map((v, i) => <VideoEmbed key={`${v.source}-${i}`} video={v} />)}
                </div>
              ) : null}

              <MasonryGallery images={s.photos} title={s.title} tone="dark" />
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
