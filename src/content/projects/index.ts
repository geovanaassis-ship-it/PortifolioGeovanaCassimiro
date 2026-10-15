import { sections } from '../site'
import type { Project, ProjectInput, SectionId } from '../types'
import { cacoProjects } from './caco'
import { c360Projects } from './c360'
import { moreInvestProjects } from './more-invest'
import { otherProjects } from './outros'

/** Um projeto ganha página própria quando tem conteúdo além do resumo. */
function hasDetail(p: ProjectInput) {
  return Boolean(
    p.context || p.objective || p.challenge || p.strategy || p.process || p.result ||
      p.responsibilities?.length || (p.gallery?.length ?? 0) > 1,
  )
}

function withSection(section: SectionId, list: ProjectInput[]): Project[] {
  return list.map((p) => ({
    ...p,
    section,
    path: `${sections[section].path}/${p.slug}`,
    hasDetail: hasDetail(p),
  }))
}

export const allProjects: Project[] = [
  ...withSection('more-invest', moreInvestProjects),
  ...withSection('caco', cacoProjects),
  ...withSection('c360', c360Projects),
  ...withSection('outros', otherProjects),
]
