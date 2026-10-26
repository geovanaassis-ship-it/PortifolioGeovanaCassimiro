import { Button, ExternalButton, buttonClass } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/PageHeader'
import { Pending } from '../components/ui/Placeholder'
import { Seo } from '../components/ui/Seo'
import { BeadWord } from '../components/ui/BeadWord'
import { WaxSeal } from '../components/ui/WaxSeal'
import { site, whatsappUrl } from '../content/site'
import { useCopy } from '../lib/hooks'

export function Contact() {
  const { copied, copy } = useCopy()

  return (
    <>
      <Seo title="Contato" description="Fale com Geovana Cassimiro: e-mail, WhatsApp, LinkedIn e Instagram." />
      <PageHeader
        code="#06"
        label="Contato"
        title={
          <>
            Vamos <span className="italic">conversar?</span>
          </>
        }
        aside={
          <div className="flex items-center gap-6 md:justify-end">
            <WaxSeal size={120} rotate={-10} />
            <BeadWord word="ola!" size={34} />
          </div>
        }
      >
        <p>Para oportunidades, projetos ou parcerias, o caminho mais rápido é o e-mail ou o WhatsApp. Também estou no LinkedIn e no Instagram.</p>
      </PageHeader>

      <section className="container-page grid gap-4 pb-10 md:grid-cols-2">
        <div className="rounded-[var(--radius-swatch)] bg-beige p-6 sm:p-8 md:col-span-2">
          <p className="label-mono text-olive">E-mail</p>
          {site.email ? (
            <>
              <a href={`mailto:${site.email}`} className="mt-2 block break-all font-display text-[clamp(1.15rem,2.2vw,1.6rem)] underline decoration-1 underline-offset-4 hover:decoration-2">
                {site.email}
              </a>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => copy(site.email!)} iconLeft={copied ? 'check' : 'copy'} variant={copied ? 'accent' : 'primary'}>
                  {copied ? 'E-mail copiado' : 'Copiar e-mail'}
                </Button>
                <a href={`mailto:${site.email}`} className={buttonClass('outline')}>
                  <Icon name="mail" size={18} /> Abrir no app de e-mail
                </a>
              </div>
              <p className="sr-only" aria-live="polite">{copied ? 'E-mail copiado para a área de transferência' : ''}</p>
            </>
          ) : (
            <p className="mt-3">{site.showPlaceholders ? <Pending>E-mail: configurar em src/content/site.ts</Pending> : 'Em breve.'}</p>
          )}
        </div>

        {whatsappUrl && (
          <div className="rounded-[var(--radius-swatch)] bg-butter p-6 sm:p-8 md:col-span-2">
            <p className="label-mono text-olive">WhatsApp</p>
            <p className="mt-2 max-w-md text-ink/80">Prefere uma conversa mais rápida? Me chame por mensagem.</p>
            <ExternalButton href={whatsappUrl} variant="primary" iconLeft="phone" className="mt-5">Chamar no WhatsApp</ExternalButton>
          </div>
        )}

        <div className="rounded-[var(--radius-swatch)] bg-midnight p-6 text-beige on-dark">
          <p className="label-mono text-rosy">LinkedIn</p>
          {site.socials.linkedin ? (
            <ExternalButton href={site.socials.linkedin} variant="light" iconLeft="linkedin" className="mt-4">Abrir LinkedIn</ExternalButton>
          ) : (
            <p className="mt-3 text-beige/80">{site.showPlaceholders ? 'Configurar em src/content/site.ts' : 'Em breve.'}</p>
          )}
        </div>
        {(site.socials.instagram || site.showPlaceholders) && (
          <div className="rounded-[var(--radius-swatch)] bg-rosy p-6">
            <p className="label-mono text-cherry">Instagram</p>
            {site.socials.instagram ? (
              <ExternalButton href={site.socials.instagram} variant="primary" iconLeft="instagram" className="mt-4">Ver perfil</ExternalButton>
            ) : (
              <p className="mt-3">Opcional — configurar em src/content/site.ts</p>
            )}
          </div>
        )}

        {site.socials.others.map((o) => (
          <ExternalButton key={o.url} href={o.url} variant="outline">{o.label}</ExternalButton>
        ))}
      </section>
    </>
  )
}
