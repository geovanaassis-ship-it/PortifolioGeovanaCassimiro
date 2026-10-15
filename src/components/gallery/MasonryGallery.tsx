import { useState } from 'react'
import type { MediaImage } from '../../content/types'
import { SmartImage } from '../ui/SmartImage'
import { Lightbox } from './Lightbox'

interface Props {
  images: MediaImage[]
  title?: string
  tone?: 'light' | 'dark'
}

/** Galeria em colunas que respeita a proporção original de cada foto + lightbox. */
export function MasonryGallery({ images, title, tone = 'light' }: Props) {
  const [index, setIndex] = useState<number | null>(null)
  if (!images.length) return null
  return (
    <>
      <ul className="masonry">
        {images.map((img, i) => (
          <li key={`${img.src}-${i}`}>
            <figure>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group block w-full overflow-hidden rounded-lg text-left"
                aria-label={`Ampliar imagem ${i + 1} de ${images.length}${img.alt ? `: ${img.alt}` : ''}`}
              >
                <SmartImage
                  image={img}
                  tint={i}
                  placeholderLabel="Foto a adicionar"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  imgClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                />
              </button>
              {img.caption && <figcaption className={`mt-2 text-sm ${tone === 'dark' ? 'text-beige/75' : 'text-ink/70'}`}>{img.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={index} onChange={setIndex} title={title} />
    </>
  )
}
