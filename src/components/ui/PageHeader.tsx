import type { ReactNode } from 'react'
import { SectionLabel } from './bits'
import { StarSticker } from './StarSticker'

interface Props {
  code: string
  label: string
  title: ReactNode
  children?: ReactNode
  /** Classes de cor da faixa (ex.: "bg-midnight text-beige"). */
  band?: string
  star?: { color: string; accent?: string }
  aside?: ReactNode
}

/** Cabeçalho padrão das páginas internas. */
export function PageHeader({ code, label, title, children, band = 'bg-oat text-ink', star, aside }: Props) {
  const dark = !band.includes('bg-oat') && !band.includes('bg-beige') && !band.includes('bg-rosy')
  return (
    <header className={`relative overflow-hidden ${band} ${dark ? 'on-dark' : ''}`}>
      {star && (
        <StarSticker size={200} color={star.color} accent={star.accent} rotate={12} className="pointer-events-none absolute -right-10 -bottom-16 opacity-90 md:right-10" />
      )}
      <div className="container-page relative grid gap-8 py-14 md:grid-cols-[1.5fr_1fr] md:items-end md:py-20">
        <div>
          <SectionLabel code={code}>{label}</SectionLabel>
          <h1 className="mt-5 text-[clamp(2.6rem,7vw,5.2rem)] font-medium">{title}</h1>
          {children && <div className="mt-6 max-w-2xl text-lg opacity-85">{children}</div>}
        </div>
        {aside && <div className="relative">{aside}</div>}
      </div>
    </header>
  )
}
