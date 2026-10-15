import { Link } from 'react-router'
import { sections } from '../../content/site'
import type { Project } from '../../content/types'
import { categoryLabel } from '../../lib/content'
import { Icon } from '../ui/Icon'
import { PlaceholderBadge } from '../ui/Placeholder'
import { SmartImage } from '../ui/SmartImage'
import { WaxSeal } from '../ui/WaxSeal'
import { sectionTheme } from './theme'

interface Props {
  project: Project
  /** Mostra o nome da seção (útil na página inicial). */
  showSection?: boolean
  priority?: boolean
}

/**
 * Card de projeto. Se o projeto tem página própria, o card inteiro leva até ela;
 * se não tem, mas tem link externo, leva à publicação original.
 */
export function ProjectCard({ project, showSection, priority }: Props) {
  const theme = sectionTheme[project.section]
  const external = !project.hasDetail ? project.links?.[0] : undefined
  const meta = [showSection ? sections[project.section].label : categoryLabel(project.section, project.category), project.year].filter(Boolean)

  const title = (
    <>
      {project.title}
      {external && <span className="sr-only"> (abre a publicação original em nova aba)</span>}
    </>
  )
  const linkClass = 'after:absolute after:inset-0 after:rounded-[var(--radius-swatch)] after:content-[""]'

  return (
    <article className="group relative flex h-full flex-col rounded-[var(--radius-swatch)] bg-paper p-3 shadow-[0_1px_0_rgb(10_51_35/0.08)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] focus-within:-translate-y-1 hover:-translate-y-1 hover:shadow-[0_14px_30px_-18px_rgb(10_51_35/0.45)]">
      <div className="relative overflow-hidden rounded-[0.9rem]">
        <SmartImage
          image={project.cover}
          ratio="4 / 3"
          priority={priority}
          tint={theme.tint}
          placeholderLabel="Capa a adicionar"
          decor={false}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          imgClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        {project.placeholder && <PlaceholderBadge className="absolute left-3 top-3" />}
      </div>
      {showSection && project.featured && (
        <WaxSeal size={64} tone="rosy" motif="star" rotate={-14} label="Projeto em destaque" className="absolute -right-3 -top-4 z-10" />
      )}
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <p className={`label-mono ${theme.accent}`}>{meta.join(' · ')}</p>
        <h3 className="mt-2 text-[1.55rem] font-semibold">
          {project.hasDetail ? (
            <Link to={project.path} className={`${linkClass} hover:underline decoration-1 underline-offset-4`}>
              {title}
            </Link>
          ) : external ? (
            <a href={external.url} target="_blank" rel="noopener noreferrer" className={`${linkClass} hover:underline decoration-1 underline-offset-4`}>
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="mt-2 text-[0.98rem] text-ink/75">{project.summary}</p>
        {project.role && <p className="mt-3 text-sm"><span className="font-semibold">Minha participação:</span> {project.role}</p>}
        {(project.hasDetail || external) && (
          <p className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold">
            {project.hasDetail ? 'Ver projeto' : `Ver no ${external!.label}`}
            <Icon name={project.hasDetail ? 'arrowRight' : 'arrowUpRight'} size={16} className="transition-transform group-hover:translate-x-1" />
          </p>
        )}
      </div>
    </article>
  )
}
