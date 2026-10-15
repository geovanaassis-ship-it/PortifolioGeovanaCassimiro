import { Link } from 'react-router'
import { Icon } from '../ui/Icon'
import { CodeMark } from '../ui/PoolBall'

/** Atalhos para as áreas do portfólio, no formato das cartelas de cor das referências. */
const items = [
  { code: '#01 · F7F4D5', title: 'Sobre mim', text: 'Trajetória, formação e o que conecta comunicação, imagem e tecnologia.', to: '/sobre', cls: 'bg-beige text-ink', hex: 'text-olive' },
  { code: '#02 · 105666', title: 'More Invest', text: 'Marketing e comunicação no mercado financeiro.', to: '/more-invest', cls: 'bg-midnight text-beige', hex: 'text-rosy' },
  { code: '#03 · 76070D', title: 'CACO e Portal C360', text: 'Liderança de conteúdo e projetos editoriais na USCS.', to: '/caco-c360', cls: 'bg-cherry text-butter', hex: 'text-rosy' },
  { code: '#04 · 0A3323', title: 'Fotografia e audiovisual', text: 'Ensaios, eventos, retratos e vídeo.', to: '/fotografia', cls: 'bg-ink text-beige', hex: 'text-moss' },
  { code: '#05 · D3968C', title: 'Outros projetos', text: 'Trabalhos acadêmicos, experimentos e estudos de caso.', to: '/outros-projetos', cls: 'bg-rosy text-ink', hex: 'text-cherry' },
]

export function SectionSwatches() {
  return (
    <ul className="flex flex-col">
      {items.map((it, i) => (
        <li key={it.to} className={i ? '-mt-4' : ''} style={{ zIndex: i }}>
          <Link
            to={it.to}
            className={`group relative flex items-end justify-between gap-6 rounded-[var(--radius-swatch)] px-6 pb-6 pt-7 shadow-[0_-6px_18px_-10px_rgb(10_51_35/0.35)] transition-transform duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-2 focus-visible:-translate-y-2 sm:px-8 ${it.cls}`}
          >
            <span>
              <span className={`font-mono text-[0.8rem] tracking-[0.12em] ${it.hex}`}>
                <CodeMark code={it.code} size={30} />
              </span>
              <span className="mt-3 block font-sans text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.02em]">{it.title}</span>
              <span className="mt-2 block max-w-md text-[0.98rem] opacity-80">{it.text}</span>
            </span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[1.5px] border-current">
              <Icon name="arrowRight" size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
