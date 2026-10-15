import type { CSSProperties } from 'react'

/** Estrela de 5 pontas com cantos arredondados (referência: estrelas bordadas e "puffy"). */
function starPoints(cx: number, cy: number, outer: number, inner: number) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`)
  }
  return pts.join(' ')
}

const OUTER = starPoints(50, 53, 40, 19)
const STITCH = starPoints(50, 53, 31, 14.5)

export type StarVariant = 'patch' | 'puffy' | 'outline'

interface Props {
  size?: number
  color?: string
  /** Cor do pesponto (patch) ou do brilho (puffy). */
  accent?: string
  variant?: StarVariant
  rotate?: number
  className?: string
  style?: CSSProperties
}

export function StarSticker({
  size = 48,
  color = 'var(--color-rosy)',
  accent = 'var(--color-paper)',
  variant = 'patch',
  rotate = 0,
  className = '',
  style,
}: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      {variant === 'outline' ? (
        <polygon points={OUTER} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
      ) : (
        <>
          <polygon points={OUTER} fill={color} stroke={color} strokeWidth={12} strokeLinejoin="round" />
          {variant === 'patch' && (
            <polygon
              points={STITCH}
              fill="none"
              stroke={accent}
              strokeWidth={2.2}
              strokeDasharray="4 3.5"
              strokeLinejoin="round"
              opacity={0.85}
            />
          )}
          {variant === 'puffy' && (
            <ellipse cx="38" cy="34" rx="9" ry="5" transform="rotate(-30 38 34)" fill={accent} opacity={0.55} />
          )}
        </>
      )}
    </svg>
  )
}
