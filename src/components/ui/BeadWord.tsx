/**
 * Palavra em miçangas de letras (referência enviada) — como uma pulseira.
 * Use em palavras curtas e decorativas.
 * `size` é o diâmetro de cada conta: em px (número) ou qualquer medida CSS, ex.: 'clamp(2rem, 8vw, 4rem)'.
 */
export function BeadWord({ word, size = 30, className = '', string = true }: { word: string; size?: number | string; className?: string; string?: boolean }) {
  const letters = [...word.toUpperCase()]
  const d = typeof size === 'number' ? `${size}px` : size
  return (
    <span className={`relative inline-flex items-center ${className}`} role="img" aria-label={word}>
      {string && <span aria-hidden="true" className="absolute inset-x-[-0.6rem] top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-ink/40" />}
      <span aria-hidden="true" className="relative inline-flex items-center gap-[3px]">
        {letters.map((ch, i) =>
          ch === ' ' ? (
            <span key={i} style={{ width: `calc(${d} * 0.4)` }} />
          ) : (
            <span
              key={i}
              className="grid place-items-center rounded-full font-sans font-bold text-[#111]"
              style={{
                width: d,
                height: d,
                fontSize: `calc(${d} * 0.48)`,
                background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f4f1ea 45%, #d9d5cb 100%)',
                boxShadow: 'inset 0 -2px 3px rgb(0 0 0 / 0.12), 0 1px 2px rgb(0 0 0 / 0.18)',
                transform: `rotate(${((i * 37) % 11) - 5}deg)`,
              }}
            >
              {ch}
            </span>
          ),
        )}
      </span>
    </span>
  )
}
