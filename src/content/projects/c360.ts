import type { ProjectInput } from '../types'

/**
 * PORTAL C360 — produção editorial, entretenimento e comunicação experimental.
 *
 * Os formatos abaixo estão como placeholder (a confirmar). Para cada um em que você
 * participou, troque placeholder para false, descreva sua participação e adicione material.
 * Apague os que não fizerem parte da sua trajetória.
 */
const formato = (slug: string, title: string, category: string): ProjectInput => ({
  slug,
  title,
  category,
  summary: '[A CONFIRMAR] Descreva o formato e qual foi a sua participação.',
  placeholder: true,
})

export const c360Projects: ProjectInput[] = [
  formato('giro-c360', 'Giro C360', 'formatos'),
  formato('diciocaco', 'DicioCaco', 'formatos'),
  formato('podcaco', 'PodCaco', 'formatos'),
  formato('cineclube', 'CineClube', 'eventos'),
  formato('comunica-day', 'Comunica Day', 'eventos'),
  formato('semiotica-e-cultura-pop', 'Semiótica e cultura pop', 'cultura-pop'),
]
