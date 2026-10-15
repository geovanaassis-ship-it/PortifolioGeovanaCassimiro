import { ButtonLink } from '../components/ui/Button'
import { CutoutWord } from '../components/ui/CutoutWord'
import { Seo } from '../components/ui/Seo'
import { StarSticker } from '../components/ui/StarSticker'

export function NotFound() {
  return (
    <section className="container-page relative flex min-h-[70vh] flex-col items-start justify-center py-20">
      <Seo title="Página não encontrada" noindex />
      <StarSticker size={90} color="var(--color-rosy)" rotate={-10} className="absolute right-8 top-16 hidden md:block" />
      <p className="label-mono text-cherry">Erro 404</p>
      <h1 className="mt-6 text-[clamp(3rem,10vw,7rem)]">
        <CutoutWord word="ops!" seed={2} />
      </h1>
      <p className="mt-8 max-w-lg text-lg text-ink/80">
        Esta página não existe ou mudou de endereço. Talvez o link esteja incompleto — ou o projeto ainda esteja em produção.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/" icon="arrowRight">Voltar ao início</ButtonLink>
        <ButtonLink to="/contato" variant="outline">Falar comigo</ButtonLink>
      </div>
    </section>
  )
}
