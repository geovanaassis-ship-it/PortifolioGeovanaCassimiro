import { ProjectList } from '../components/projects/ProjectList'
import { PageHeader } from '../components/ui/PageHeader'
import { Seo } from '../components/ui/Seo'
import { sections } from '../content/site'
import { projectsBySection } from '../lib/content'
import { useProjects } from '../lib/projects'

export function MoreInvest() {
  const projects = useProjects()
  const meta = sections['more-invest']
  return (
    <>
      <Seo title="More Invest" description="Projetos de marketing e comunicação desenvolvidos por Geovana Cassimiro na More Invest, empresa do mercado financeiro." />
      <PageHeader
        code={meta.code}
        label="Experiência · Marketing"
        band="bg-midnight text-beige"
        star={{ color: 'var(--color-ink)', accent: 'var(--color-midnight)' }}
        title={
          <>
            More <span className="italic">Invest</span>
          </>
        }
      >
        <p>
          Trabalho no marketing da More Invest, empresa do mercado financeiro. Aqui reúno peças e projetos públicos em que participei — com o contexto de cada um e o que foi de fato a minha parte.
        </p>
        <p className="mt-4 text-base opacity-75">
          Comunicar finanças pede clareza sem simplificação excessiva. Por isso, além das peças, procuro mostrar as decisões por trás delas.
        </p>
      </PageHeader>

      <section className="container-page py-14 md:py-20" aria-label="Projetos More Invest">
        <ProjectList projects={projects && projectsBySection(projects, 'more-invest')} categories={meta.categories} label="projetos da More Invest" />
        <p className="mt-12 max-w-2xl border-l-2 border-midnight pl-4 text-sm text-ink/65">
          Todos os materiais exibidos já foram publicados pela empresa. Informações internas, de clientes ou de investidores não fazem parte deste portfólio.
        </p>
      </section>
    </>
  )
}
