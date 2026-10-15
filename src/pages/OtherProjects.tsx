import { ProjectList } from '../components/projects/ProjectList'
import { PageHeader } from '../components/ui/PageHeader'
import { Seo } from '../components/ui/Seo'
import { sections } from '../content/site'
import { projectsBySection } from '../lib/content'

export function OtherProjects() {
  const meta = sections.outros
  return (
    <>
      <Seo title="Outros projetos" description="Trabalhos acadêmicos, projetos experimentais e estudos de caso de Geovana Cassimiro." />
      <PageHeader
        code={meta.code}
        label="Acadêmicos e experimentais"
        band="bg-rosy text-ink"
        star={{ color: 'var(--color-cherry)', accent: 'var(--color-rosy)' }}
        title={
          <>
            Outros <span className="italic">projetos</span>
          </>
        }
      >
        <p>Trabalhos da faculdade, experimentos e estudos de caso. Nos projetos em grupo, indico a minha contribuição e quem participou comigo.</p>
      </PageHeader>
      <section className="container-page py-14 md:py-20" aria-label="Outros projetos">
        <ProjectList projects={projectsBySection('outros')} categories={meta.categories} label="outros projetos" />
      </section>
    </>
  )
}
