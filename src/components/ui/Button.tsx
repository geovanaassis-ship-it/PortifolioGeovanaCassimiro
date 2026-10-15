import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { Icon, type IconName } from './Icon'

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'light' | 'outline-light'

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.95rem] font-semibold leading-none transition-[transform,background-color,color,box-shadow] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 min-h-11'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-oat hover:bg-midnight shadow-[0_3px_0_var(--color-cherry)] hover:shadow-[0_5px_0_var(--color-cherry)]',
  accent: 'bg-cherry text-butter hover:bg-[#8e0a12] shadow-[0_3px_0_var(--color-ink)] hover:shadow-[0_5px_0_var(--color-ink)]',
  outline: 'border-[1.5px] border-ink text-ink hover:bg-ink hover:text-oat',
  light: 'bg-butter text-ink hover:bg-beige shadow-[0_3px_0_var(--color-rosy)] hover:shadow-[0_5px_0_var(--color-rosy)]',
  'outline-light': 'border-[1.5px] border-beige/70 text-beige hover:bg-beige hover:text-ink',
}

export const buttonClass = (variant: ButtonVariant = 'primary', extra = '') => `${base} ${variants[variant]} ${extra}`

interface Common {
  variant?: ButtonVariant
  icon?: IconName
  iconLeft?: IconName
  children: ReactNode
}

function Content({ icon, iconLeft, children }: Omit<Common, 'variant'>) {
  return (
    <>
      {iconLeft && <Icon name={iconLeft} size={18} />}
      <span>{children}</span>
      {icon && <Icon name={icon} size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  )
}

export function Button({ variant, icon, iconLeft, children, className = '', ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={buttonClass(variant, className)} {...rest}>
      <Content icon={icon} iconLeft={iconLeft}>{children}</Content>
    </button>
  )
}

export function ButtonLink({ variant, icon, iconLeft, children, className = '', ...rest }: Common & LinkProps) {
  return (
    <Link className={buttonClass(variant, className)} {...rest}>
      <Content icon={icon} iconLeft={iconLeft}>{children}</Content>
    </Link>
  )
}

/** Link externo: abre em nova aba e avisa leitores de tela. */
export function ExternalButton({ variant, icon = 'arrowUpRight', iconLeft, children, className = '', ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a target="_blank" rel="noopener noreferrer" className={buttonClass(variant, className)} {...rest}>
      <Content icon={icon} iconLeft={iconLeft}>{children}</Content>
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}
