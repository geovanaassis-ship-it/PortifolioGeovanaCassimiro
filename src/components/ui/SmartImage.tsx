import { useState, type CSSProperties } from 'react'
import type { MediaImage } from '../../content/types'
import { Icon } from './Icon'
import { StarSticker } from './StarSticker'

const tints = ['var(--color-beige)', '#e6dccb', '#dfe5cf', '#ecd6cf', '#d7e2e2']

interface Props {
  image?: MediaImage | null
  /** Força uma proporção (ex.: "4 / 5"). Sem ela, usa width/height da imagem. */
  ratio?: string
  /** "cover" recorta para preencher a área; "contain" mostra a imagem inteira. */
  fit?: 'cover' | 'contain'
  className?: string
  imgClassName?: string
  priority?: boolean
  /** Rótulo exibido no espaço reservado. */
  placeholderLabel?: string
  tint?: number
  sizes?: string
  /** Mostra a estrela decorativa no espaço reservado. */
  decor?: boolean
}

/**
 * Imagem com proporção reservada (sem "pulos"), carregamento preguiçoso e tratamento de erro.
 * Quando `src` está vazio, mostra um espaço reservado claramente identificado.
 */
export function SmartImage({
  image,
  ratio,
  fit = 'cover',
  className = '',
  imgClassName = '',
  priority = false,
  placeholderLabel = 'Imagem a adicionar',
  tint = 0,
  sizes,
  decor = true,
}: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const aspect = ratio ?? (image?.width && image?.height ? `${image.width} / ${image.height}` : '4 / 3')
  const style: CSSProperties = { aspectRatio: aspect }

  if (!image?.src) {
    return (
      <div
        className={`placeholder-art relative grid place-items-center overflow-hidden text-ink ${className}`}
        style={{ ...style, ['--ph-bg' as string]: tints[tint % tints.length] }}
        role="img"
        aria-label={image?.alt ?? placeholderLabel}
      >
        {decor && <StarSticker size={40} color="var(--color-rosy)" variant="patch" rotate={-12} className="absolute right-4 top-4 opacity-80" />}
        <span className="label-mono flex flex-col items-center gap-1 text-center text-ink/60">
          <Icon name="camera" size={22} />
          {placeholderLabel}
          <span className="text-[0.65rem] normal-case tracking-normal">{aspect.replace(/\s/g, '')}</span>
        </span>
      </div>
    )
  }

  if (failed) {
    return (
      <div className={`grid place-items-center bg-beige text-ink/60 ${className}`} style={style} role="img" aria-label={`${image.alt} (imagem indisponível)`}>
        <span className="label-mono flex flex-col items-center gap-1">
          <Icon name="imageOff" size={22} />
          Imagem indisponível
        </span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-beige ${className}`} style={style}>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full transition-opacity duration-500 ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  )
}
