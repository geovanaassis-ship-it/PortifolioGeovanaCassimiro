import { Link, useLocation } from 'react-router'
import { sections } from '../content/site'
import { isVideo, type MediaImage, type MediaVideo } from '../content/types'
import { categoryLabel, findProjectByPath, siblings } from '../lib/content'
import { useProjects } from '../lib/projects'
import { MasonryGallery } from '../components/gallery/MasonryGallery'
import { VideoEmbed } from '../components/gallery/VideoEmbed'
import { sectionTheme } from '../components/projects/theme'
import { Icon } from '../components/ui/Icon'
import { PlaceholderBadge } from '../components/ui/Placeholder'
import { Seo } from '../components/ui/Seo'
import { SmartImage } from '../components/ui/SmartImage'
import { SectionLabel, Tag, TextLinkExternal } from '../components/ui/bits'
import { NotFound } from './NotFound'

const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)

function Block({ title, text }: { title: string; text?: string }) {
  if (!text) return null
  return (
    <section className="grid gap-3 border-t border-ink/15 pt-6 md:grid-cols-[12rem_1fr] md:gap-8">
      <h2 className="label-mono pt-1 !font-mono !text-[0.78rem] !tracking-[0.08em]">{title}</h2>
      <div className="prose-body max-w-[42rem] text-[1.08rem]">{paragraphs(text)}</div>
    </section>
  )
}

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label-mono text-ink/55">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  )
}

export function ProjectPage() {
  const { pathname } = useLocation()
  const projects = useProjects()
  if (!projects) return <p className="label-mono container-page py-32 text-center text-ink/55">Carregando projeto…</p>
  const project = findProjectByPath(projects, pathname)
  if (!project || !project.hasDetail) return <NotFound />

  const section = sections[project.section]
  const theme = sectionTheme[project.section]
  const { prev, next } = siblings(projects, project)
  const images = (project.gallery ?? []).filter((g): g is MediaImage => !isVideo(g))
  const videos = (project.gallery ?? []).filter((g): g is MediaVideo => isVideo(g))
  const backLabel = project.section === 'caco' || project.section === 'c360' ? 'CACO e Portal C360' : section.label

  return (
    <article>
      <Seo title={project.title} description={project.summary} image={project.cover?.src || undefined} noindex={project.placeholder} />

      <header className={`${project.section === 'outros' ? '' : 'on-dark'} ${theme.swatch}`}>
        <div className="container-page py-10 md:py-14">
          <Link to={section.path} className="label-mono inline-flex items-center gap-2 opacity-80 hover:opacity-100 hover:underline">
            <Icon name="arrowLeft" size={16} /> {backLabel}
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SectionLabel code={section.code}>{project.area ?? categoryLabel(project.section, project.category)}</SectionLabel>
            {project.placeholder && <PlaceholderBadge />}
          </div>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,6vw,4.6rem)] font-medium">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-lg opacity-90">{project.summary}</p>
        </div>
      </header>

      <div className="container-page">
        <div className="-mt-0 pt-10 md:pt-14">
          <SmartImage image={project.cover} ratio="16 / 9" priority tint={theme.tint} placeholderLabel="Capa a adicionar" className="rounded-[var(--radius-swatch)]" sizes="(min-width: 1248px) 1168px, 100vw" />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_17rem]">
          <div className="order-2 space-y-10 lg:order-1">
            <Block title="Contexto" text={project.context} />
            <Block title="Objetivo" text={project.objective} />
            <Block title="Desafio" text={project.challenge} />
            <Block title="Estratégia / conceito" text={project.strategy} />
            {project.responsibilities?.length ? (
              <section className="grid gap-3 border-t border-ink/15 pt-6 md:grid-cols-[12rem_1fr] md:gap-8">
                <h2 className="label-mono pt-1 !font-mono !text-[0.78rem]">O que eu fiz</h2>
                <ul className="max-w-[42rem] space-y-2 text-[1.08rem]">
                  {project.responsibilities.map((r) => (
                    <li key={r} className="flex gap-3">
                      <span aria-hidden="true" className={`mt-[0.55em] h-2 w-2 shrink-0 rotate-45 ${theme.swatch.split(' ')[0]}`} />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <Block title="Processo" text={project.process} />
            {project.result && (
              <section className="grid gap-3 border-t border-ink/15 pt-6 md:grid-cols-[12rem_1fr] md:gap-8">
                <h2 className="label-mono pt-1 !font-mono !text-[0.78rem]">Resultado</h2>
                <div className="max-w-[42rem]">
                  <div className="prose-body text-[1.08rem]">{paragraphs(project.result.text)}</div>
                  {project.result.source && <p className="mt-3 text-sm text-ink/60">Fonte: {project.result.source}</p>}
                </div>
              </section>
            )}
          </div>

          <aside className="order-1 lg:order-2">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-[var(--radius-swatch)] bg-paper p-6 lg:sticky lg:top-24 lg:grid-cols-1">
              {project.year && <MetaItem label="Ano">{project.year}</MetaItem>}
              {project.role && <MetaItem label="Minha participação">{project.role}</MetaItem>}
              {project.tools?.length ? <MetaItem label="Ferramentas">{project.tools.join(', ')}</MetaItem> : null}
              {project.deliverables?.length ? (
                <MetaItem label="Entregáveis">
                  <ul>{project.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
                </MetaItem>
              ) : null}
              {project.collaborators?.length ? (
                <MetaItem label="Equipe">
                  <ul>
                    {project.collaborators.map((c, i) => (
                      <li key={`${c.name}-${i}`}>
                        {c.name}
                        {c.role && <span className="text-ink/60"> — {c.role}</span>}
                      </li>
                    ))}
                  </ul>
                </MetaItem>
              ) : null}
              {project.tags?.length ? (
                <div className="col-span-2 flex flex-wrap gap-2 lg:col-span-1">
                  {project.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                </div>
              ) : null}
              {project.links?.length ? (
                <div className="col-span-2 space-y-2 lg:col-span-1">
                  <dt className="label-mono text-ink/55">Links</dt>
                  {project.links.map((l) => (
                    <dd key={l.url}>
                      <TextLinkExternal href={l.url}>{l.label}</TextLinkExternal>
                    </dd>
                  ))}
                </div>
              ) : null}
            </dl>
          </aside>
        </div>

        {(images.length > 0 || videos.length > 0) && (
          <section className="mt-16" aria-labelledby="galeria">
            <h2 id="galeria" className="mb-6 text-3xl font-medium">Galeria</h2>
            {videos.length > 0 && (
              <div className="mb-8 grid gap-6 md:grid-cols-2">
                {videos.map((v, i) => <VideoEmbed key={`${v.source}-${i}`} video={v} />)}
              </div>
            )}
            <MasonryGallery images={images} title={project.title} />
          </section>
        )}

        {(prev || next) && (
          <nav aria-label="Outros projetos da seção" className="mt-20 grid gap-4 border-t border-ink/15 pt-8 sm:grid-cols-2">
            {prev ? (
              <Link to={prev.path} className="group rounded-[var(--radius-swatch)] p-4 hover:bg-paper">
                <span className="label-mono flex items-center gap-2 text-ink/60"><Icon name="arrowLeft" size={16} /> Anterior</span>
                <span className="mt-1 block font-display text-2xl">{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link to={next.path} className="group rounded-[var(--radius-swatch)] p-4 text-right hover:bg-paper">
                <span className="label-mono flex items-center justify-end gap-2 text-ink/60">Próximo <Icon name="arrowRight" size={16} /></span>
                <span className="mt-1 block font-display text-2xl">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </article>
  )
}
