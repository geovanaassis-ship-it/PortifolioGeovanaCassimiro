import { useEffect, useRef, useState } from 'react'
import type { MediaImage } from '../../content/types'
import { Icon } from '../ui/Icon'
import { SmartImage } from '../ui/SmartImage'

interface Props {
  images: MediaImage[]
  /** Índice aberto; null = fechado. */
  index: number | null
  onChange: (index: number | null) => void
  title?: string
}

const pad = (n: number) => String(n).padStart(4, '0')

/**
 * Visualização ampliada com navegação por setas (teclado e botões), gesto de arrastar no celular,
 * Esc para fechar e devolução do foco ao elemento que abriu.
 */
export function Lightbox({ images, index, onChange, title }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const opener = useRef<Element | null>(null)
  const touchX = useRef<number | null>(null)
  const open = index !== null
  const total = images.length

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      opener.current = document.activeElement
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && d.open) {
      d.close()
    }
  }, [open])

  // Pré-carrega as vizinhas.
  useEffect(() => {
    if (index === null) return
    for (const i of [index - 1, index + 1]) {
      const src = images[(i + total) % total]?.src
      if (src) new Image().src = src
    }
  }, [index, images, total])

  const go = (delta: number) => index !== null && total > 1 && onChange((index + delta + total) % total)

  const img = index !== null ? images[index] : null

  return (
    <dialog
      ref={ref}
      aria-label={title ? `Galeria: ${title}` : 'Galeria de imagens'}
      className="lightbox on-dark m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-beige"
      onClose={() => {
        document.documentElement.style.overflow = ''
        onChange(null)
        if (opener.current instanceof HTMLElement) opener.current.focus()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onChange(null)
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
    >
      {img && (
        <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && onChange(null)}>
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="label-mono flex items-center gap-2" aria-live="polite">
              <span className="rec-dot inline-block h-2 w-2 rounded-full bg-rosy" aria-hidden="true" />
              <span>
                IMG_{pad(index! + 1)} <span className="opacity-50">/ {pad(total)}</span>
              </span>
              {title && <span className="hidden normal-case tracking-normal opacity-70 sm:inline">· {title}</span>}
            </p>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-beige/40 px-4 text-sm font-semibold hover:bg-beige hover:text-ink"
            >
              Fechar <Icon name="close" size={18} />
            </button>
          </div>

          <figure className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-2 sm:px-20">
            <LightboxImage key={`${img.src}-${index}`} image={img} />
            {img.caption && <figcaption className="mt-3 max-w-2xl px-4 text-center text-sm text-beige/80">{img.caption}</figcaption>}

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Imagem anterior"
                  className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-beige/10 hover:bg-beige hover:text-ink sm:grid"
                >
                  <Icon name="chevronLeft" size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Próxima imagem"
                  className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-beige/10 hover:bg-beige hover:text-ink sm:grid"
                >
                  <Icon name="chevronRight" size={24} />
                </button>
              </>
            )}
          </figure>

          {total > 1 && (
            <div className="flex items-center justify-center gap-3 px-4 pb-5 pt-3 sm:hidden">
              <button type="button" onClick={() => go(-1)} aria-label="Imagem anterior" className="grid h-12 w-12 place-items-center rounded-full bg-beige/10">
                <Icon name="chevronLeft" size={22} />
              </button>
              <span className="label-mono opacity-70">deslize</span>
              <button type="button" onClick={() => go(1)} aria-label="Próxima imagem" className="grid h-12 w-12 place-items-center rounded-full bg-beige/10">
                <Icon name="chevronRight" size={22} />
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}

function LightboxImage({ image }: { image: MediaImage }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <p className="label-mono flex flex-col items-center gap-2 text-beige/70">
        <Icon name="imageOff" size={28} /> Imagem indisponível
      </p>
    )
  }
  if (!image.src) {
    const ratio = image.width && image.height ? image.width / image.height : 4 / 3
    return (
      <div style={{ width: `min(92vw, calc((100dvh - 11rem) * ${ratio}))` }}>
        <SmartImage image={image} ratio={`${ratio}`} placeholderLabel="Foto a adicionar" className="rounded-lg" />
      </div>
    )
  }
  return (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      onError={() => setFailed(true)}
      className="h-auto max-h-[calc(100dvh-11rem)] w-auto max-w-full rounded-sm object-contain"
    />
  )
}
