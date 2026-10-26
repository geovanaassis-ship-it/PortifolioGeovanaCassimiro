import { useState, type FormEvent } from 'react'
import { Button, ExternalButton, buttonClass } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/PageHeader'
import { Pending } from '../components/ui/Placeholder'
import { Seo } from '../components/ui/Seo'
import { BeadWord } from '../components/ui/BeadWord'
import { WaxSeal } from '../components/ui/WaxSeal'
import { site } from '../content/site'
import { FORMSPREE_ID } from '../lib/env'
import { useCopy, useResumeAvailable } from '../lib/hooks'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Formulário enviado de verdade via Formspree. Só é exibido quando VITE_FORMSPREE_ID está configurado.
 */
function ContactForm({ formId }: { formId: string }) {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const field = 'mt-2 w-full rounded-xl border-[1.5px] border-ink/25 bg-paper px-4 py-3 text-base outline-none transition-colors focus:border-ink focus-visible:outline-none focus:ring-2 focus:ring-cherry/40'

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Nome
          <input name="nome" required autoComplete="name" className={field} />
        </label>
        <label className="block text-sm font-semibold">
          E-mail
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Mensagem
        <textarea name="mensagem" required rows={6} className={`${field} resize-y`} />
      </label>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === 'sending'} className={buttonClass('primary')}>
          {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
          <Icon name="arrowRight" size={18} />
        </button>
        <p role="status" className="text-sm">
          {status === 'sent' && <span className="font-semibold text-olive">Mensagem enviada. Obrigada! Respondo assim que puder.</span>}
          {status === 'error' && (
            <span className="font-semibold text-cherry">
              Não foi possível enviar agora.{site.email ? ` Escreva direto para ${site.email}.` : ' Tente novamente em instantes.'}
            </span>
          )}
        </p>
      </div>
    </form>
  )
}

export function Contact() {
  const { copied, copy } = useCopy()
  const resume = useResumeAvailable()

  return (
    <>
      <Seo title="Contato" description="Fale com Geovana Cassimiro: e-mail, LinkedIn e canais profissionais." />
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
            <WaxSeal size={120} tone="moss" motif="gc" rotate={-10} />
            <BeadWord word="ola!" size={34} />
          </div>
        }
      >
        <p>Para oportunidades, projetos ou parcerias, o caminho mais rápido é o e-mail ou o WhatsApp. Também estou no LinkedIn e no Instagram.</p>
      </PageHeader>

      <section className="container-page grid gap-10 pb-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="rounded-[var(--radius-swatch)] bg-beige p-6 sm:p-8">
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

          {site.phone && (
            <div className="rounded-[var(--radius-swatch)] bg-butter p-6 sm:p-8">
              <p className="label-mono text-olive">Telefone e WhatsApp</p>
              <a href={`tel:+${site.phone.e164}`} className="mt-2 block font-display text-[clamp(1.4rem,3.2vw,2rem)] underline decoration-1 underline-offset-4 hover:decoration-2">
                {site.phone.display}
              </a>
              <div className="mt-6 flex flex-wrap gap-3">
                <ExternalButton href={`https://wa.me/${site.phone.e164}`} variant="primary" iconLeft="phone">Chamar no WhatsApp</ExternalButton>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          {site.socials.others.map((o) => (
            <ExternalButton key={o.url} href={o.url} variant="outline">{o.label}</ExternalButton>
          ))}
          {resume && (
            <a href={site.resumePath} target="_blank" rel="noopener" className={buttonClass('outline')}>
              <Icon name="download" size={18} /> Currículo em PDF <span className="sr-only">(abre em nova aba)</span>
            </a>
          )}
        </div>

        <div className="rounded-[var(--radius-swatch)] border-[1.5px] border-ink/15 p-6 sm:p-8">
          <h2 className="font-display text-3xl font-medium">Mande uma mensagem</h2>
          {FORMSPREE_ID ? (
            <div className="mt-6">
              <ContactForm formId={FORMSPREE_ID} />
            </div>
          ) : (
            <div className="mt-4 space-y-4 text-ink/80">
              <p>
                Prefere escrever com calma? {site.email ? 'Use o botão de e-mail ao lado — a mensagem chega direto na minha caixa de entrada.' : 'Em breve, um e-mail de contato estará disponível aqui.'}
              </p>
              {site.showPlaceholders && (
                <p>
                  <Pending>Formulário desativado: configure VITE_FORMSPREE_ID (ver README)</Pending>
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
