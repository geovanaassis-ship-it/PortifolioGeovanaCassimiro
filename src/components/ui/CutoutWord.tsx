import type { CSSProperties } from 'react'

/**
 * Palavra em letras recortadas, inspirada no alfabeto em colagem das referências.
 * Use com moderação: no nome da página inicial e em títulos de destaque.
 */
const styles: { bg: string; fg: string; font: string; extra?: string }[] = [
  { bg: 'var(--color-cherry)', fg: 'var(--color-butter)', font: 'font-display font-black' },
  { bg: 'var(--color-butter)', fg: 'var(--color-cherry)', font: 'font-display italic font-semibold' },
  { bg: 'var(--color-midnight)', fg: 'var(--color-beige)', font: 'font-sans font-bold' },
  { bg: 'var(--color-rosy)', fg: 'var(--color-ink)', font: 'font-display font-extrabold', extra: 'stitch' },
  { bg: 'var(--color-paper)', fg: 'var(--color-ink)', font: 'font-mono font-medium' },
  { bg: 'var(--color-moss)', fg: 'var(--color-ink)', font: 'font-display font-black italic' },
  { bg: 'var(--color-ink)', fg: 'var(--color-rosy)', font: 'font-display font-medium' },
]

const rotations = [-4, 3, -2, 5, -3, 2, -5, 4]
const offsets = ['0', '0.04em', '-0.03em', '0.02em', '-0.02em', '0.05em']

interface Props {
  word: string
  className?: string
  /** Desloca o padrão de cores para variar entre usos. */
  seed?: number
}

export function CutoutWord({ word, className = '', seed = 0 }: Props) {
  return (
    <span className={`cutout ${className}`} role="img" aria-label={word}>
      {[...word].map((ch, i) => {
        const s = styles[(i + seed) % styles.length]
        const style = {
          background: s.bg,
          color: s.fg,
          '--r': `${rotations[(i + seed) % rotations.length]}deg`,
          '--y': offsets[(i + seed) % offsets.length],
        } as CSSProperties
        return (
          <span key={i} aria-hidden="true" className={`cutout-letter ${s.font} ${s.extra ?? ''}`} style={style}>
            {ch}
          </span>
        )
      })}
    </span>
  )
}
