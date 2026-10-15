import { useId } from 'react'

/**
 * Selo de cera em relevo (referência enviada). Funciona como "assinatura" visual.
 * Use com moderação: destaques, rodapé, contato.
 */
const tones = {
  rosy: { base: '#d89a92', dark: '#a8665f', light: '#f1c4bc', gold: '#c9a24a' },
  moss: { base: '#8fa27a', dark: '#5f7350', light: '#bccaa9', gold: '#d8c78e' },
  midnight: { base: '#1e3a6e', dark: '#10224a', light: '#4c6aa3', gold: '#d4b25a' },
  cherry: { base: '#8a1a1f', dark: '#5a0a0e', light: '#b8494c', gold: '#e2c06a' },
  gold: { base: '#c9a24a', dark: '#8f6f25', light: '#ecd38b', gold: '#fff2c4' },
}

export type SealTone = keyof typeof tones
export type SealMotif = 'gc' | 'star' | 'moon'

/** Contorno irregular de cera derretida. */
function blobPath() {
  const pts: string[] = []
  const bumps = [0, 2.2, -1.2, 3, 0.5, -1.8, 2.6, 1, -0.6, 2.8, -1.4, 1.6]
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2
    const r = 46 + bumps[i % bumps.length] * Math.sin(a * 3 + 0.6) * 0.9
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join(' L')}Z`
}
const BLOB = blobPath()

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

export function WaxSeal({ size = 88, tone = 'rosy', motif = 'gc', rotate = -8, className = '', label }: Props) {
  const id = useId().replace(/:/g, '')
  const t = tones[tone]
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`inline-block shrink-0 drop-shadow-[0_6px_8px_rgb(10_51_35/0.25)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <radialGradient id={`w${id}`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor={t.light} />
          <stop offset="0.55" stopColor={t.base} />
          <stop offset="1" stopColor={t.dark} />
        </radialGradient>
        <radialGradient id={`i${id}`} cx="60%" cy="65%" r="70%">
          <stop offset="0" stopColor={t.light} stopOpacity="0.6" />
          <stop offset="1" stopColor={t.dark} stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.5" stopColor={t.gold} />
          <stop offset="1" stopColor="#8a6a1f" />
        </linearGradient>
      </defs>
      <path d={BLOB} fill={`url(#w${id})`} />
      {/* área prensada */}
      <circle cx="50" cy="50" r="33" fill={`url(#i${id})`} />
      <circle cx="50" cy="50" r="33" fill="none" stroke={t.dark} strokeOpacity="0.45" strokeWidth="1.6" />
      <circle cx="50" cy="50" r="29" fill="none" stroke={`url(#g${id})`} strokeWidth="1.1" strokeDasharray="0.1 3.2" strokeLinecap="round" />
      {motif === 'gc' && (
        <text x="50" y="50" dy="0.34em" textAnchor="middle" fontFamily="'Fraunces Variable', Georgia, serif" fontStyle="italic" fontWeight="600" fontSize="27" fill={`url(#g${id})`} stroke={t.dark} strokeOpacity="0.35" strokeWidth="0.5">
          gc
        </text>
      )}
      {motif === 'star' && <polygon points={star(50, 51, 17, 7.5)} fill={`url(#g${id})`} stroke={t.dark} strokeOpacity="0.3" strokeWidth="0.6" strokeLinejoin="round" />}
      {motif === 'moon' && (
        <>
          <path d="M57 32a19 19 0 1 0 0 36a15 15 0 1 1 0-36Z" fill={`url(#g${id})`} />
          <polygon points={star(62, 44, 6, 2.6)} fill={`url(#g${id})`} />
        </>
      )}
      <ellipse cx="30" cy="22" rx="10" ry="4" transform="rotate(-30 30 22)" fill="#fff" opacity="0.22" />
    </svg>
  )
}
