import { useEffect, useRef, type RefObject } from 'react'
import { NavLink } from 'react-router'
import { navigation, site } from '../../content/site'
import { Icon } from '../ui/Icon'
import { CodeMark } from '../ui/PoolBall'

/** Cores de cada item, como uma pilha de cartelas. */
const swatches = [
  'bg-oat text-ink',
  'bg-beige text-ink',
  'bg-midnight text-beige',
  'bg-cherry text-butter',
  'bg-ink text-rosy',
  'bg-olive text-beige',
  'bg-rosy text-ink',
]

interface Props {
  open: boolean
  onClose: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}

/**
 * Menu mobile em tela cheia. Usa <dialog> nativo: prende o foco, fecha com Esc
 * e devolve o foco ao botão "Menu".
 */
export function MobileMenu({ open, onClose, returnFocus }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && d.open) {
      d.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label="Menu"
      onClose={() => {
        document.documentElement.style.overflow = ''
        onClose()
        returnFocus.current?.focus()
      }}
      className="menu-dialog m-0 h-dvh max-h-none w-full max-w-none bg-oat p-0 text-ink"
    >
      <div className="container-page flex h-full flex-col py-4">
        <div className="flex h-14 items-center justify-between">
          <span className="label-mono">Navegação</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-oat"
          >
            Fechar <Icon name="close" size={18} />
          </button>
        </div>
        <nav aria-label="Principal (mobile)" className="mt-4 flex-1 overflow-y-auto">
          <ul className="flex flex-col">
            {navigation.map((item, i) => (
              <li key={item.path} className={i > 0 ? '-mt-3' : ''} style={{ zIndex: i }}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `relative flex items-end justify-between rounded-[var(--radius-swatch)] px-5 pb-4 pt-6 shadow-[0_-2px_10px_rgb(10_51_35/0.08)] ${swatches[i % swatches.length]} ${isActive ? 'ring-2 ring-inset ring-current' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>
                        <span className="label-mono block"><CodeMark code={item.code} size={24} /></span>
                        <span className="font-display text-[1.9rem] font-semibold leading-tight">{item.label}</span>
                      </span>
                      {isActive ? <span className="label-mono">aqui</span> : <Icon name="arrowRight" size={22} />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {site.socials.linkedin && (
          <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="label-mono mt-4 inline-flex items-center gap-2 py-3">
            <Icon name="linkedin" size={18} /> LinkedIn <span className="sr-only">(abre em nova aba)</span>
          </a>
        )}
      </div>
    </dialog>
  )
}
