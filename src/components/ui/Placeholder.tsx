import type { ReactNode } from 'react'

/** Selo que identifica conteúdo de exemplo / a substituir. */
export function PlaceholderBadge({ children = 'Exemplo · substituir', className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={`label-mono inline-flex items-center gap-1.5 rounded-full border border-dashed border-cherry bg-butter px-2.5 py-1 !text-[0.68rem] text-cherry ${className}`}
    >
      <span aria-hidden="true">✶</span>
      {children}
    </span>
  )
}

/** Texto ou campo ainda não configurado. */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-dashed border-cherry/60 bg-butter/60 px-1.5 py-0.5 font-mono text-[0.8em] text-cherry">
      {children}
    </span>
  )
}
