import type { ReactNode } from 'react'
import { StarSticker } from '../ui/StarSticker'
import { Viewfinder } from '../ui/bits'

interface Props {
  children: ReactNode
  /** Cor do corpo da câmera. */
  body?: string
  className?: string
  label?: string
}

/**
 * Câmera digital compacta desenhada em CSS (referência: molduras de câmeras dos anos 2000).
 * A "tela" recebe qualquer conteúdo: texto, retrato ou imagem.
 */
export function CameraFrame({ children, body = 'var(--color-moss)', className = '', label = 'GC-07' }: Props) {
  return (
    <div
      className={`relative rounded-[1.6rem] p-3 pr-[5.5rem] shadow-[inset_0_2px_0_rgb(255_255_255/0.35),inset_0_-3px_0_rgb(0_0_0/0.15),0_24px_40px_-24px_rgb(10_51_35/0.6)] sm:pr-24 ${className}`}
      style={{ background: `linear-gradient(160deg, color-mix(in oklab, ${body} 82%, white), ${body} 45%, color-mix(in oklab, ${body} 80%, black))` }}
    >
      {/* Tela */}
      <div className="on-dark relative overflow-hidden rounded-[0.9rem] border-[6px] border-ink/85 bg-ink text-beige">
        {children}
        <Viewfinder className="text-beige/70" />
      </div>

      {/* Controles */}
      <div aria-hidden="true" className="absolute inset-y-3 right-3 flex w-[4.5rem] flex-col items-center justify-between py-2 sm:w-20">
        <div className="flex w-full items-center justify-between px-1">
          <span className="h-2.5 w-2.5 rounded-full bg-cherry shadow-[inset_0_-1px_0_rgb(0_0_0/0.3)]" />
          <span className="h-1.5 w-7 rounded-full bg-ink/25" />
        </div>
        <div className="relative grid h-[3.6rem] w-[3.6rem] place-items-center rounded-full bg-[conic-gradient(from_200deg,#e9e6dc,#a9aea0,#f4f1e8,#9fa496,#e9e6dc)] shadow-[0_2px_0_rgb(0_0_0/0.2)] sm:h-16 sm:w-16">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#c8cabe)] font-mono text-[0.45rem] text-ink/70">OK</span>
        </div>
        <div className="flex gap-2">
          <span className="h-4 w-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#b9bcae)]" />
          <span className="h-4 w-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#b9bcae)]" />
        </div>
        <span className="font-mono text-[0.55rem] tracking-widest text-ink/60">{label}</span>
      </div>

      <StarSticker size={44} color="#c9ccc4" accent="#ffffff" variant="puffy" rotate={-18} className="absolute -left-4 -top-4 drop-shadow-sm" />
      <StarSticker size={34} color="var(--color-rosy)" variant="patch" rotate={16} className="absolute -bottom-3 right-16" />
    </div>
  )
}
