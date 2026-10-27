import { CameraFrame } from '../components/home/CameraFrame'
import { ButtonLink, ExternalButton } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/PageHeader'
import { Pending } from '../components/ui/Placeholder'
import { Seo } from '../components/ui/Seo'
import { SmartImage } from '../components/ui/SmartImage'
import { SectionLabel } from '../components/ui/bits'
import { BeadWord } from '../components/ui/BeadWord'
import { PoolBall } from '../components/ui/PoolBall'
import { skills, story, timeline, tools } from '../content/about'
import { site } from '../content/site'
import { isPlaceholderText } from '../lib/hooks'
import { toolLogos } from '../components/ui/tool-logos'

/** Mostra o texto, destacando trechos "[A PREENCHER]" quando os placeholders estão ativos. */
function Field({ text }: { text: string }) {
  if (!isPlaceholderText(text)) return <>{text}</>
  if (!site.showPlaceholders) return <>{text.replace(/\s*\[[^\]]*\]\s*/g, ' ').trim() || '—'}</>
  return (
    <>
      {text.split(/(\[[^\]]*\])/).map((part, i) => (part.startsWith('[') ? <Pending key={i}>{part}</Pending> : part))}
    </>
  )
}

export function About() {

  return (
    <>
      <Seo title="Sobre mim" description="Trajetória, formação e competências de Geovana Cassimiro: Publicidade e Propaganda na USCS, marketing, conteúdo, fotografia e tecnologia." />
      <PageHeader
        code="#01"
        label="Sobre mim"
        title={
          <>
            Comunicação, imagem <span className="italic">e um pé na tecnologia</span>
          </>
        }
        aside={
          <CameraFrame body="#c9ccc2" label="RETRATO" className="mx-auto max-w-[24rem]">
            {site.portrait ? (
              <SmartImage image={site.portrait} priority sizes="(min-width: 768px) 384px, 90vw" />
            ) : (
              <div className="placeholder-art grid aspect-[4/5] place-items-center text-ink" style={{ ['--ph-bg' as string]: 'var(--color-beige)' }}>
                {site.showPlaceholders ? (
                  <span className="label-mono flex flex-col items-center gap-1 text-center text-ink/60">
                    <Icon name="camera" size={22} />
                    Retrato a adicionar
                    <span className="text-[0.65rem] normal-case tracking-normal">site.portrait</span>
                  </span>
                ) : (
                  <span className="font-display text-7xl">GC</span>
                )}
              </div>
            )}
          </CameraFrame>
        }
      >
        <p>
          Estudante de Publicidade e Propaganda na USCS, no 7º semestre, com formação anterior em Análise e Desenvolvimento de Sistemas. Trabalho com marketing, conteúdo e produção visual.
        </p>
        {site.socials.linkedin && (
          <div className="mt-7 flex flex-wrap gap-3">
            <ExternalButton href={site.socials.linkedin} iconLeft="linkedin" icon="arrowUpRight">LinkedIn</ExternalButton>
          </div>
        )}
      </PageHeader>

      <section className="container-page py-16 md:py-24" aria-label="Minha trajetória">
        <div className="space-y-16">
          {story.map((block, i) => (
            <div key={block.title} className="grid gap-4 md:grid-cols-[5rem_14rem_1fr] md:gap-8">
              <PoolBall n={i + 1} size={40} label={`parte ${i + 1}`} />
              <h2 className="text-[1.75rem] font-medium leading-tight">{block.title}</h2>
              <div className="prose-body max-w-[40rem] text-[1.12rem] leading-[1.7]">
                {block.paragraphs.map((p) => <p key={p}>{p}</p>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="on-dark bg-ink py-16 text-beige md:py-24" aria-labelledby="trajetoria">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <SectionLabel code="✶" className="text-rosy">Linha do tempo</SectionLabel>
            <h2 id="trajetoria" className="mt-4 text-[clamp(2rem,4.5vw,3.2rem)] font-medium">
              Onde estou <span className="italic text-rosy">e de onde vim</span>
            </h2>
            <BeadWord word="trajetoria" size={24} className="mt-8 [&>span:first-child]:bg-beige/40" />
          </div>
          <ol className="relative border-l border-beige/25">
            {timeline.map((t) => (
              <li key={t.title} className="relative pb-9 pl-8 last:pb-0">
                <span aria-hidden="true" className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rotate-45 bg-rosy" />
                <p className="label-mono text-beige/60"><Field text={t.period} /></p>
                <p className="mt-1 font-display text-2xl">{t.title}</p>
                <p className="text-beige/80">
                  <Field text={t.place} />
                  {t.note && <span className="text-beige/55"> · {t.note}</span>}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-16 md:py-24" aria-labelledby="competencias">
        <SectionLabel code="#01.2">Competências</SectionLabel>
        <h2 id="competencias" className="mt-4 text-[clamp(2rem,4.5vw,3.2rem)] font-medium">
          O que eu <span className="italic">faço</span>
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g, i) => (
            <div key={g.group} className={`rounded-[var(--radius-swatch)] p-6 ${['bg-beige', 'bg-paper', 'bg-[#e4ead7]', 'bg-[#f1ddd8]'][i % 4]}`}>
              <PoolBall n={i + 1} size={34} />
              <h3 className="mt-2 font-sans text-xl font-bold tracking-tight">{g.group}</h3>
              <ul className="mt-4 space-y-2 text-[0.98rem]">
                {g.items.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {tools.length > 0 && (
          <div className="mt-14">
            <h3 className="label-mono">Ferramentas</h3>
            <ul className="mt-4 flex flex-wrap gap-3">
              {tools.map((id) => {
                const logo = toolLogos[id]
                return (
                  <li key={id} title={logo.name} className="grid h-16 w-16 place-items-center rounded-2xl border-[1.5px] border-ink/10 bg-white/70 shadow-[0_2px_0_rgb(10_51_35/0.08)] transition-transform hover:-translate-y-0.5">
                    <svg viewBox="0 0 24 24" width="30" height="30" fill={logo.color} role="img" aria-label={logo.name}>
                      <path d={logo.path} />
                    </svg>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className="mt-16 flex flex-wrap gap-3">
          <ButtonLink to="/more-invest" icon="arrowRight">Ver trabalhos</ButtonLink>
          <ButtonLink to="/contato" variant="outline">Contato</ButtonLink>
        </div>
      </section>
    </>
  )
}
