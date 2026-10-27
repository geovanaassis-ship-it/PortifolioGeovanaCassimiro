/**
 * Palavra em miçangas de letras (referência enviada) — como uma pulseira.
 * O diâmetro de cada conta vem de `size` (px) ou, sem ele, do font-size herdado
 * (ex.: className="text-[clamp(2rem,7vw,4rem)]"), o que permite tamanhos responsivos.
 */
export function BeadWord({ word, size, className = '', string = true }: { word: string; size?: number; className?: string; string?: boolean }) {
  const letters = [...word.toUpperCase()]
  return (
    <span className={`relative inline-flex items-center leading-none ${className}`} style={size ? { fontSize: size } : undefined} role="img" aria-label={word}>
      {string && <span aria-hidden="true" className="absolute inset-x-[-0.35em] top-1/2 h-[max(2px,0.06em)] -translate-y-1/2 rounded-full bg-ink/40" />}
      <span aria-hidden="true" className="relative inline-flex items-center gap-[0.08em]">
        {letters.map((ch, i) =>
          ch === ' ' ? (
            <span key={i} className="w-[0.4em]" />
          ) : (
            <span
              key={i}
              className="grid h-[1em] w-[1em] place-items-center rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f4f1ea 45%, #d9d5cb 100%)',
                boxShadow: 'inset 0 -0.06em 0.1em rgb(0 0 0 / 0.12), 0 0.03em 0.06em rgb(0 0 0 / 0.2)',
                transform: `rotate(${((i * 37) % 11) - 5}deg)`,
              }}
            >
              <span className="font-sans text-[0.48em] font-bold text-[#111]">{ch}</span>
            </span>
          ),
        )}
      </span>
    </span>
  )
}
