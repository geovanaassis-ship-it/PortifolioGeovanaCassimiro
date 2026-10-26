import { headline, intro } from '../../content/about'
import { site } from '../../content/site'
import { ButtonLink, buttonClass } from '../ui/Button'
import { BeadWord } from '../ui/BeadWord'
import { CutoutWord } from '../ui/CutoutWord'
import { Icon } from '../ui/Icon'
import { CameraFrame } from './CameraFrame'

const words = ['estratégia', 'conteúdo', 'imagem', 'tecnologia']

export function Hero() {
  return (
    <section className="container-page grid items-center gap-12 pb-16 pt-10 md:pt-16 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:pb-24">
      <div>
        <p className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-ink/70">
          <span>Publicidade e Propaganda · USCS</span>
          <span aria-hidden="true">✶</span>
          <span>Marketing · Conteúdo · Imagem</span>
        </p>

        <h1 className="mt-6">
          <span className="sr-only">{site.name}</span>
          <span aria-hidden="true" className="block">
            <CutoutWord word="Geovana" className="text-[clamp(3rem,10.5vw,6.6rem)]" />
            <BeadWord word="Cassimiro" size="clamp(2rem, 8.4vw, 3.9rem)" className="ml-[0.6rem] mt-4" />
          </span>
        </h1>

        <p className="mt-8 max-w-xl font-display text-[clamp(1.5rem,3vw,2.1rem)] leading-tight">
          {headline.split('. ').map((part, i, arr) => (
            <span key={i} className={i === 1 ? 'italic text-cherry' : ''}>
              {part}
              {i < arr.length - 1 ? '. ' : ''}
            </span>
          ))}
        </p>
        <p className="mt-5 max-w-xl text-lg text-ink/80">{intro}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/sobre" icon="arrowRight">Conhecer minha trajetória</ButtonLink>
          <a href="#destaques" className={buttonClass('outline')}>
            Ver trabalhos
          </a>
        </div>

        <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
          {site.socials.linkedin && (
            <li>
              <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:text-cherry">
                <Icon name="linkedin" /> LinkedIn<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          )}
          {site.socials.instagram && (
            <li>
              <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:text-cherry">
                <Icon name="instagram" /> Instagram<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          )}
        </ul>
      </div>

      <div className="mx-auto w-full max-w-[30rem] lg:max-w-none">
        <CameraFrame>
          <div className="relative flex aspect-[4/3.1] flex-col justify-between p-6 sm:p-7">
            <div className="label-mono flex items-center justify-between text-[0.7rem] text-beige/80">
              <span className="flex items-center gap-2">
                <span className="rec-dot h-2 w-2 rounded-full bg-rosy" /> REC
              </span>
              <span>P · 4:3</span>
            </div>
            <div>
              <p className="label-mono text-[0.7rem] text-rosy">comunicação =</p>
              <p className="relative mt-1 h-[1.2em] overflow-hidden font-display text-[clamp(2rem,5vw,3rem)] italic leading-[1.2]" aria-label={words.join(', ')}>
                <span aria-hidden="true" className="block motion-safe:animate-[word-cycle_10s_var(--ease-out-soft)_infinite]">
                  {[...words, words[0]].map((w, i) => (
                    <span key={i} className="block h-[1.2em]">
                      {w}
                    </span>
                  ))}
                </span>
              </p>
            </div>
            <div className="label-mono flex items-end justify-between text-[0.7rem] text-beige/70">
              <span>briefing → ideia → peça</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </CameraFrame>
      </div>
    </section>
  )
}
