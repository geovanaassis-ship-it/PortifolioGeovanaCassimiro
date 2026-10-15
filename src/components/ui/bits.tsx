import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { CodeMark } from './PoolBall'
import { StarSticker } from './StarSticker'

/** Rótulo de seção no estilo das cartelas de cor: código + nome. */
export function SectionLabel({ code, children, className = '' }: { code?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`label-mono flex items-center gap-3 ${className}`}>
      {code && <CodeMark code={code} />}
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  )
}

export function Tag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-current/25 px-2.5 py-0.5 text-[0.8rem] ${className}`}>
      {children}
    </span>
  )
}

/** Estado vazio de uma seção (sem projetos visíveis). */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-swatch)] border border-dashed border-ink/30 px-6 py-14 text-center">
      <StarSticker size={44} variant="outline" color="var(--color-moss)" rotate={8} />
      <p className="font-display text-2xl">{title}</p>
      {children && <div className="max-w-md text-ink/70">{children}</div>}
    </div>
  )
}

/** Cantos de visor de câmera sobre um elemento posicionado. */
export function Viewfinder({ className = '' }: { className?: string }) {
  const corner = 'absolute h-5 w-5 border-current'
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-3 ${className}`}>
      <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  )
}

/** Link de texto externo com seta. */
export function TextLinkExternal({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-1.5 font-semibold underline decoration-1 underline-offset-4 transition-colors hover:decoration-2 ${className}`}
    >
      {children}
      <Icon name="arrowUpRight" size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}
