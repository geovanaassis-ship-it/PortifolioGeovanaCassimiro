import { useId } from 'react'

/**
 * Selo de cera em relevo — o logo do site. Funciona como "assinatura" visual.
 * Camadas: cera com borda ondulada e granulado, aro levantado, disco prensado,
 * anel duplo e o monograma "GC" em relevo (sombra + brilho).
 */
const tones = {
  sage: { base: '#bfd0b8', dark: '#7f9878', light: '#eef4ea', ink: '#5d7254' },
  rosy: { base: '#d89a92', dark: '#a8665f', light: '#f1c4bc', ink: '#8d4f49' },
  moss: { base: '#8fa27a', dark: '#5f7350', light: '#bccaa9', ink: '#4d5f3f' },
  midnight: { base: '#1e3a6e', dark: '#10224a', light: '#4c6aa3', ink: '#0b1838' },
  cherry: { base: '#8a1a1f', dark: '#5a0a0e', light: '#b8494c', ink: '#4a0609' },
  gold: { base: '#c9a24a', dark: '#8f6f25', light: '#ecd38b', ink: '#76591a' },
}

export type SealTone = keyof typeof tones
export type SealMotif = 'gc' | 'star' | 'moon'

/** Contorno de cera derretida: seis gomos suaves com pequenas irregularidades. */
function blobPath(radius: number) {
  const pts: string[] = []
  const wobble = [0, 0.6, -0.4, 0.9, -0.2, 0.5, -0.7, 0.3]
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2
    const r = radius + 3.4 * Math.cos(6 * a + 0.4) + wobble[i % wobble.length] * 0.6
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join(' L')}Z`
}
const OUTER = blobPath(44.5)
const RIM = blobPath(38.5)

function star(cx: number, cy: number, o: number, i: number) {
  return Array.from({ length: 10 }, (_, k) => {
    const r = k % 2 ? i : o
    const a = (Math.PI / 5) * k - Math.PI / 2
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
}

interface Props {
  size?: number
  tone?: SealTone
  motif?: SealMotif
  rotate?: number
  className?: string
  label?: string
}

export function WaxSeal({ size = 88, tone = 'sage', motif = 'gc', rotate = -8, className = '', label }: Props) {
  const id = useId().replace(/:/g, '')
  const t = tones[tone]
  const small = size < 56

  /** Desenha o motivo três vezes: sombra (embaixo à direita), brilho (em cima à esquerda) e a face. */
  const emboss = (shape: (fill: string, dx: number, dy: number, opacity?: number) => React.ReactNode) => (
    <>
      {shape(t.ink, 0.8, 0.9, 0.9)}
      {shape('#ffffff', -0.55, -0.6, 0.75)}
      {shape(`url(#f${id})`, 0, 0)}
    </>
  )

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`inline-block shrink-0 drop-shadow-[0_5px_7px_rgb(10_51_35/0.28)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        {/* cera: luz vindo de cima à esquerda */}
        <radialGradient id={`w${id}`} cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor={t.light} />
          <stop offset="0.5" stopColor={t.base} />
          <stop offset="1" stopColor={t.dark} />
        </radialGradient>
        {/* aro levantado: claro em cima, escuro embaixo */}
        <linearGradient id={`r${id}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={t.light} />
          <stop offset="0.55" stopColor={t.base} />
          <stop offset="1" stopColor={t.dark} />
        </linearGradient>
        {/* disco prensado: o inverso do aro (sombra em cima, luz embaixo) */}
        <linearGradient id={`p${id}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={t.dark} stopOpacity="0.55" />
          <stop offset="0.45" stopColor={t.base} />
          <stop offset="1" stopColor={t.light} />
        </linearGradient>
        {/* face do monograma */}
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.light} />
          <stop offset="0.6" stopColor={t.base} />
          <stop offset="1" stopColor={t.ink} />
        </linearGradient>
        {/* granulado da cera */}
        <filter id={`n${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.38" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.25" />
        </filter>
        {/* manchas maiores, como cera derretida de forma irregular */}
        <filter id={`m${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="3" result="blot" />
          <feColorMatrix in="blot" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -0.75" />
        </filter>
        <clipPath id={`c${id}`}>
          <path d={OUTER} />
        </clipPath>
      </defs>

      <path d={OUTER} fill={`url(#w${id})`} />
      <path d={RIM} fill={`url(#r${id})`} stroke={t.dark} strokeOpacity="0.25" strokeWidth="0.6" />

      {/* disco prensado com borda funda */}
      <circle cx="50" cy="50" r="31" fill={`url(#p${id})`} />
      <circle cx="50" cy="50" r="31" fill="none" stroke={t.dark} strokeOpacity="0.55" strokeWidth="1.3" />
      <circle cx="50.4" cy="50.5" r="31.9" fill="none" stroke={t.light} strokeOpacity="0.8" strokeWidth="0.7" />

      {/* anel duplo em relevo */}
      {emboss((fill, dx, dy, o = 1) => (
        <g key={`ring-${dx}`} transform={`translate(${dx} ${dy})`} opacity={o}>
          <circle cx="50" cy="50" r="28" fill="none" stroke={fill} strokeWidth="1.05" />
          <circle cx="50" cy="50" r="26.2" fill="none" stroke={fill} strokeWidth="0.55" />
        </g>
      ))}

      {motif === 'gc' &&
        emboss((fill, dx, dy, o = 1) => (
          <text
            key={`gc-${dx}`}
            x={50 + dx}
            y={50 + dy}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Fraunces Variable', Georgia, serif"
            fontWeight="700"
            fontSize={small ? 27 : 24}
            letterSpacing="0.6"
            fill={fill}
            stroke={fill === `url(#f${id})` ? t.ink : 'none'}
            strokeOpacity="0.45"
            strokeWidth="0.35"
            opacity={o}
          >
            GC
          </text>
        ))}
      {motif === 'star' && emboss((fill, dx, dy, o = 1) => <polygon key={`s-${dx}`} points={star(50 + dx, 51 + dy, 15, 6.5)} fill={fill} opacity={o} strokeLinejoin="round" />)}
      {motif === 'moon' &&
        emboss((fill, dx, dy, o = 1) => (
          <g key={`m-${dx}`} transform={`translate(${dx} ${dy})`} opacity={o}>
            <path d="M57 33a17 17 0 1 0 0 34a13.5 13.5 0 1 1 0-34Z" fill={fill} />
            <polygon points={star(61, 45, 5.5, 2.4)} fill={fill} />
          </g>
        ))}

      {/* textura por cima de tudo, só dentro da cera */}
      <g clipPath={`url(#c${id})`}>
        <rect width="100" height="100" filter={`url(#m${id})`} opacity="0.35" style={{ mixBlendMode: 'soft-light' }} />
        {!small && <rect width="100" height="100" filter={`url(#n${id})`} opacity="0.1" style={{ mixBlendMode: 'multiply' }} />}
      </g>

      {/* brilho da cera */}
      <path d="M22 30 Q30 16 46 12" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="74" cy="78" rx="7" ry="2.2" transform="rotate(-38 74 78)" fill="#fff" opacity="0.18" />
    </svg>
  )
}
