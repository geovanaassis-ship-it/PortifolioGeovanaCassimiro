import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { navigation, site } from '../../content/site'
import { Icon } from '../ui/Icon'
import { StarSticker } from '../ui/StarSticker'
import { MobileMenu } from './MobileMenu'

export function Monogram() {
  return (
    <span className="relative inline-grid h-10 w-10 place-items-center rounded-xl bg-ink font-display text-lg font-semibold italic text-beige">
      gc
      <StarSticker size={18} color="var(--color-rosy)" variant="puffy" rotate={14} className="absolute -right-1.5 -top-1.5" />
    </span>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${scrolled ? 'bg-oat/90 shadow-[0_1px_0_rgb(10_51_35/0.12)] backdrop-blur-md' : 'bg-oat'}`}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-3 rounded-xl" aria-label={`${site.name} — início`}>
          <Monogram />
          <span className="font-display text-lg font-medium leading-none tracking-tight">
            Geovana <span className="italic">Cassimiro</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.slice(1).map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors ${
                      isActive ? 'bg-ink text-oat' : 'text-ink hover:bg-ink/[0.07]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuButton}
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-ink px-4 py-2 text-sm font-semibold lg:hidden"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          Menu <Icon name="menu" size={18} />
        </button>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} returnFocus={menuButton} />
    </header>
  )
}
