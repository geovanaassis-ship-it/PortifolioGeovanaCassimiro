import { ProjectList } from '../components/projects/ProjectList'
import { PageHeader } from '../components/ui/PageHeader'
import { Seo } from '../components/ui/Seo'
import { StarSticker } from '../components/ui/StarSticker'
import { CodeMark } from '../components/ui/PoolBall'
import { sections } from '../content/site'
import { projectsBySection } from '../lib/content'

const fronts = [
  {
    id: 'caco',
    letter: 'A',
    section: sections.caco,
    title: 'CACO',
    subtitle: 'Centro Acadêmico de Comunicação',
    role: 'Head de Conteúdo',
    text: 'Como Head de Conteúdo, cuido do que o centro acadêmico comunica aos estudantes: planejamento, organização editorial, campanhas, peças e a coordenação de quem produz junto comigo.',
    band: 'bg-cherry text-butter',
    star: 'var(--color-rosy)',
  },
  {
    id: 'c360',
    letter: 'B',
    section: sections.c360,
    title: 'Portal C360',
    subtitle: 'Produção editorial e comunicação experimental',
    role: 'Projetos editoriais e criativos',
    text: 'No Portal C360, desenvolvo projetos editoriais e criativos — um espaço para testar formatos, linguagens e referências de cultura pop com o público da comunicação.',
    band: 'bg-olive text-beige',
    star: 'var(--color-butter)',
  },
] as const

export function CacoC360() {
  return (
    <>
      <Seo title="CACO e Portal C360" description="Atuação de Geovana Cassimiro como Head de Conteúdo do CACO (USCS) e em projetos editoriais e criativos do Portal C360." />
      <PageHeader
        code="#03"
        label="Universidade · USCS"
        title={
          <>
            CACO <span className="italic">e</span> Portal C360
          </>
        }
        star={{ color: 'var(--color-rosy)', accent: 'var(--color-oat)' }}
      >
        <p>Duas frentes dentro da universidade: a liderança de conteúdo no centro acadêmico e a produção editorial e experimental do Portal C360.</p>
        <nav aria-label="Frentes" className="mt-7 flex flex-wrap gap-3">
          {fronts.map((f) => (
            <a key={f.id} href={`#${f.id}`} className={`inline-flex min-h-11 items-center gap-3 rounded-full px-5 py-2 font-semibold ${f.band}`}>
              <CodeMark code={f.section.code} size={24} /> {f.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      {fronts.map((f) => (
        <section key={f.id} id={f.id} className="container-page pt-10 md:pt-14" aria-labelledby={`${f.id}-titulo`}>
          <div className={`on-dark relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 md:py-12 ${f.band}`}>
            <StarSticker size={110} color={f.star} accent="transparent" variant="outline" rotate={-10} className="absolute -right-4 -top-6 opacity-70" />
            <p className="label-mono flex items-center gap-2">
              <CodeMark code={f.section.code} size={30} /> <span className="opacity-80">· Frente {f.letter}</span>
            </p>
            <h2 id={`${f.id}-titulo`} className="mt-3 text-[clamp(2.2rem,5.5vw,4rem)] font-medium">
              {f.title}
            </h2>
            <p className="font-display text-xl italic opacity-90">{f.subtitle}</p>
            <div className="mt-6 grid gap-6 md:grid-cols-[14rem_1fr]">
              <p>
                <span className="label-mono block opacity-70">Minha função</span>
                <span className="font-semibold">{f.role}</span>
              </p>
              <p className="max-w-2xl text-lg opacity-90">{f.text}</p>
            </div>
          </div>
          <div className="py-10">
            <ProjectList projects={projectsBySection(f.section.id)} categories={f.section.categories} label={`projetos do ${f.title}`} />
          </div>
        </section>
      ))}
    </>
  )
}
