import { Hero } from '../components/home/Hero'
import { SectionSwatches } from '../components/home/SectionSwatches'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ButtonLink } from '../components/ui/Button'
import { Seo } from '../components/ui/Seo'
import { StarSticker } from '../components/ui/StarSticker'
import { CodeMark } from '../components/ui/PoolBall'
import { WaxSeal } from '../components/ui/WaxSeal'
import { EmptyState, SectionLabel } from '../components/ui/bits'
import { featuredProjects } from '../lib/content'

const now = [
  { where: 'More Invest', what: 'Marketing no mercado financeiro' },
  { where: 'CACO · USCS', what: 'Head de Conteúdo' },
  { where: 'Portal C360', what: 'Projetos editoriais e criativos' },
  { where: 'Câmera', what: 'Fotografia e audiovisual' },
]

export function Home() {
  const featured = featuredProjects().slice(0, 6)
  return (
    <>
      <Seo />
      <Hero />

      <section aria-label="Onde estou agora" className="border-y border-ink/15 bg-beige">
        <div className="container-page grid grid-cols-2 gap-px md:grid-cols-4">
          {now.map((n) => (
            <div key={n.where} className="py-6 pr-4">
              <p className="label-mono text-olive">{n.where}</p>
              <p className="mt-1 font-display text-lg leading-snug">{n.what}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="destaques" className="container-page py-20 md:py-28" aria-labelledby="destaques-titulo">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel code="✶">Seleção</SectionLabel>
            <h2 id="destaques-titulo" className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-medium">
              Trabalhos em <span className="italic">destaque</span>
            </h2>
          </div>
          <p className="max-w-sm text-ink/70">Uma amostra do que faço em marketing, conteúdo e produção visual. Cada projeto mostra o contexto e a minha parte nele.</p>
        </div>
        {featured.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <li key={p.path}>
                <ProjectCard project={p} showSection priority={i < 2} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Seleção em montagem">Os primeiros projetos em destaque entram aqui em breve.</EmptyState>
        )}
      </section>

      <section className="container-page grid gap-12 pb-8 lg:grid-cols-[1fr_1.5fr] lg:gap-16" aria-labelledby="areas-titulo">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel code="✶">Mapa do portfólio</SectionLabel>
          <h2 id="areas-titulo" className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-medium">
            Cinco frentes, <span className="italic">um mesmo olhar</span>
          </h2>
          <p className="mt-5 max-w-md text-ink/75">
            Comunicação corporativa, projetos acadêmicos e fotografia parecem mundos diferentes. Para mim, são o mesmo exercício: entender quem vai receber a mensagem e escolher a melhor forma de mostrá-la.
          </p>
          <StarSticker size={64} color="var(--color-moss)" accent="var(--color-beige)" rotate={-8} className="mt-8 hidden lg:block" />
        </div>
        <SectionSwatches />
      </section>

      <section className="container-page pt-20">
        <div className="on-dark relative overflow-hidden rounded-[2rem] bg-cherry px-6 py-14 text-butter sm:px-12">
          <WaxSeal size={130} tone="gold" motif="gc" rotate={12} className="absolute -right-4 -top-6 hidden sm:block" />
          <p className="label-mono text-rosy"><CodeMark code="#06 · Contato" size={30} /></p>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4.6vw,3.4rem)] font-medium">
            Tem um projeto, uma vaga ou uma ideia? <span className="italic">Vamos conversar.</span>
          </h2>
          <div className="mt-8">
            <ButtonLink to="/contato" variant="light" icon="arrowRight">Entrar em contato</ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
