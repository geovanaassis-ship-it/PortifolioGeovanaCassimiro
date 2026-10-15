import { useId } from 'react'

/**
 * Bola de sinuca numerada (referência enviada). Usada em toda numeração do site.
 * 1–8: bolas lisas. 9–15: listradas, com a cor da bola (n - 8).
 */
const colors = [
  '#151515', // 0 / 8
  '#e2b33c', // 1 amarela
  '#1e3a6e', // 2 azul
  '#d3968c', // 3 rosa (rosy brown da paleta)
  '#4b3b8c', // 4 roxa
  '#d9682b', // 5 laranja
  '#0a3323', // 6 verde (dark green da paleta)
  '#76070d', // 7 vinho (cherry da paleta)
]

export const ballColor = (n: number) => colors[((n - 1) % 8) + 1 === 8 ? 0 : ((n - 1) % 8) + 1]

interface Props {
  n: number
  size?: number
  className?: string
  /** Texto para leitores de tela; sem ele, a bola é decorativa. */
  label?: string
}

export function PoolBall({ n, size = 28, className = '', label }: Props) {
  const id = useId().replace(/:/g, '')
  const color = ballColor(n)
  const striped = n > 8
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <radialGradient id={`s${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
        <clipPath id={`c${id}`}>
          <circle cx="20" cy="20" r="19" />
        </clipPath>
      </defs>
      <g clipPath={`url(#c${id})`}>
        <circle cx="20" cy="20" r="19" fill={striped ? '#f4efe2' : color} />
        {striped && <rect x="0" y="9" width="40" height="22" fill={color} />}
        <circle cx="20" cy="20" r="19" fill={`url(#s${id})`} />
      </g>
      <circle cx="20" cy="20" r="9.2" fill="#f7f1e2" />
      <text
        x="20"
        y="20"
        dy="0.36em"
        textAnchor="middle"
        fontFamily="'Instrument Sans Variable', system-ui, sans-serif"
        fontWeight="700"
        fontSize={n > 9 ? 9.5 : 12}
        fill="#111"
      >
        {n}
      </text>
      <ellipse cx="13" cy="10" rx="4.5" ry="2.4" transform="rotate(-25 13 10)" fill="#fff" opacity="0.5" />
    </svg>
  )
}

/**
 * Converte códigos como "#03A", "#01.2" ou "#02 · 105666" em bola + sufixo.
 * Códigos sem número (ex.: "✶") são exibidos como texto.
 */
export function CodeMark({ code, size = 26 }: { code: string; size?: number }) {
  const m = code.match(/^#0*(\d+)(.*)$/)
  if (!m || Number(m[1]) === 0) return <span className="opacity-60">{code}</span>
  const n = Number(m[1])
  const rest = m[2].trim()
  return (
    <span className="inline-flex items-center gap-2">
      <PoolBall n={n} size={size} label={`número ${n}`} />
      {rest && <span className="opacity-70">{rest}</span>}
    </span>
  )
}
