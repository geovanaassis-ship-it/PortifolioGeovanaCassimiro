import { Link } from 'react-router'
import { navigation, site, whatsappUrl } from '../../content/site'
import { Icon } from '../ui/Icon'
import { StarSticker } from '../ui/StarSticker'
import { WaxSeal } from '../ui/WaxSeal'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="on-dark relative mt-24 overflow-hidden bg-ink text-beige">
      <StarSticker size={140} color="var(--color-midnight)" accent="var(--color-moss)" rotate={-14} className="absolute -right-8 -top-10 opacity-70" />
      <div className="container-page relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <WaxSeal size={84} className="mb-6" />
          <p className="font-display text-4xl leading-tight md:text-5xl">
            Vamos <span className="italic text-rosy">conversar?</span>
          </p>
          <p className="mt-4 max-w-sm text-beige/75">Para oportunidades, projetos ou parcerias em comunicação, marketing e conteúdo.</p>
          <Link to="/contato" className="mt-6 inline-flex items-center gap-2 font-semibold text-butter underline decoration-1 underline-offset-4 hover:decoration-2">
            Ir para contato <Icon name="arrowRight" size={18} />
          </Link>
        </div>
        <nav aria-label="Rodapé">
          <p className="label-mono mb-4 text-beige/60">Páginas</p>
          <ul className="space-y-2">
            {navigation.map((n) => (
              <li key={n.path}>
                <Link to={n.path} className="hover:text-butter hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="label-mono mb-4 text-beige/60">Canais</p>
          <ul className="space-y-2">
            {site.socials.linkedin && (
              <li>
                <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-butter">
                  <Icon name="linkedin" size={18} /> LinkedIn <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>
            )}
            {site.socials.instagram && (
              <li>
                <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-butter">
                  <Icon name="instagram" size={18} /> Instagram <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>
            )}
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 break-all hover:text-butter">
                  <Icon name="mail" size={18} /> {site.email}
                </a>
              </li>
            )}
            {whatsappUrl && (
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-butter">
                  <Icon name="phone" size={18} /> WhatsApp <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>
            )}
            {!site.socials.linkedin && !site.email && <li className="text-beige/60">Canais em configuração.</li>}
          </ul>
        </div>
      </div>
      <div className="container-page relative flex flex-col gap-2 border-t border-beige/15 py-6 text-sm text-beige/60 sm:flex-row sm:justify-between">
        <p>© {year} {site.name}</p>
        <p className="label-mono">Publicidade · Comunicação · Imagem</p>
      </div>
    </footer>
  )
}
