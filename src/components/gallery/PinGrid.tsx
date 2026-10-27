import { useEffect, useMemo, useState } from 'react'
import type { GalleryPhoto } from '../../lib/gallery-types'
import type { MediaImage } from '../../content/types'
import { formatDate } from '../../lib/gallery'
import { SmartImage } from '../ui/SmartImage'
import { Lightbox } from './Lightbox'

interface Props {
  photos: GalleryPhoto[]
  nicheLabel: (id: string) => string
}

/** Colunas por largura de tela: 2 no celular, 3 no tablet, 4 no computador. */
function useColumns() {
  const get = () => (typeof window === 'undefined' ? 4 : window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4)
  const [cols, setCols] = useState(get)
  useEffect(() => {
    const onResize = () => setCols(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return cols
}

/**
 * Grade no estilo Pinterest: cada foto mantém a proporção original e entra na coluna
 * mais baixa, então a leitura segue a ordem da galeria da esquerda para a direita.
 * Ao passar o mouse aparecem o nome, o nicho e a data; clicar amplia.
 */
export function PinGrid({ photos, nicheLabel }: Props) {
  const cols = useColumns()
  const [index, setIndex] = useState<number | null>(null)

  const columns = useMemo(() => {
    const out: { photo: GalleryPhoto; i: number }[][] = Array.from({ length: cols }, () => [])
    const heights = Array(cols).fill(0)
    photos.forEach((photo, i) => {
      const c = heights.indexOf(Math.min(...heights))
      out[c].push({ photo, i })
      heights[c] += photo.height / photo.width
    })
    return out
  }, [photos, cols])

  const lightboxImages: MediaImage[] = useMemo(
    () =>
      photos.map((p) => ({
        src: p.src,
        alt: altText(p, nicheLabel),
        width: p.width,
        height: p.height,
        caption: [p.title, nicheLabel(p.niche), formatDate(p.date)].filter(Boolean).join(' · '),
      })),
    [photos, nicheLabel],
  )

  return (
    <>
      <div className="flex gap-3 sm:gap-4">
        {columns.map((col, c) => (
          <ul key={c} className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
            {col.map(({ photo, i }) => (
              <li key={photo.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group relative block w-full overflow-hidden rounded-xl text-left"
                  aria-label={`Ampliar: ${altText(photo, nicheLabel)}`}
                >
                  <SmartImage
                    image={{ src: photo.src, thumb: photo.thumb, alt: '', width: photo.width, height: photo.height }}
                    tint={i}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    imgClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent px-3 pb-3 pt-10 text-beige opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <span className="font-display text-base leading-tight sm:text-lg">{photo.title || nicheLabel(photo.niche)}</span>
                    <span className="label-mono text-[0.65rem] text-beige/80">
                      {[photo.title ? nicheLabel(photo.niche) : null, formatDate(photo.date)].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <Lightbox images={lightboxImages} index={index} onChange={setIndex} />
    </>
  )
}

function altText(p: GalleryPhoto, nicheLabel: (id: string) => string) {
  return [p.title || 'Foto', nicheLabel(p.niche), formatDate(p.date)].filter(Boolean).join(', ')
}
