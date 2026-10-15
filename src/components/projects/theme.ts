import type { SectionId } from '../../content/types'

/** Cor de cada seção — derivada das cartelas de referência. */
export const sectionTheme: Record<SectionId, { swatch: string; accent: string; tint: number }> = {
  'more-invest': { swatch: 'bg-midnight text-beige', accent: 'text-midnight', tint: 4 },
  caco: { swatch: 'bg-cherry text-butter', accent: 'text-cherry', tint: 3 },
  c360: { swatch: 'bg-olive text-beige', accent: 'text-olive', tint: 2 },
  outros: { swatch: 'bg-rosy text-ink', accent: 'text-ink', tint: 1 },
}
