import type { Category } from '../../content/types'

interface Props {
  categories: Category[]
  value: string
  onChange: (id: string) => void
  /** Rótulo acessível do grupo. */
  label: string
  tone?: 'light' | 'dark'
  counts?: Record<string, number>
}

/** Filtros por categoria (botões com aria-pressed). "all" = todos. */
export function FilterBar({ categories, value, onChange, label, tone = 'light', counts }: Props) {
  const all = [{ id: 'all', label: 'Todos' }, ...categories]
  const idle = tone === 'light' ? 'border-ink/25 hover:border-ink text-ink' : 'border-beige/30 hover:border-beige text-beige'
  const active = tone === 'light' ? 'bg-ink text-oat border-ink' : 'bg-beige text-ink border-beige'
  return (
    <div role="group" aria-label={label} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible">
      {all.map((c) => {
        const pressed = value === c.id
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(c.id)}
            className={`shrink-0 whitespace-nowrap rounded-full border-[1.5px] px-4 py-2 text-sm font-medium transition-colors ${pressed ? active : idle}`}
          >
            {c.label}
            {counts && c.id !== 'all' && <span className="ml-1.5 font-mono text-xs opacity-60">{counts[c.id] ?? 0}</span>}
          </button>
        )
      })}
    </div>
  )
}
