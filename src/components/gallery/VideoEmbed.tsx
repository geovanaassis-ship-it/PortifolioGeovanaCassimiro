import { useState } from 'react'
import type { MediaVideo } from '../../content/types'
import { Icon } from '../ui/Icon'
import { SmartImage } from '../ui/SmartImage'

const embedUrl = (v: MediaVideo) =>
  v.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.source)}?autoplay=1&rel=0`
    : `https://player.vimeo.com/video/${encodeURIComponent(v.source)}?autoplay=1&dnt=1`

/**
 * Vídeo com "fachada": o player externo só carrega quando a pessoa clica em reproduzir.
 * Mantém a página leve e evita cookies de terceiros antes da interação.
 */
export function VideoEmbed({ video }: { video: MediaVideo }) {
  const [active, setActive] = useState(false)

  if (!video.source) {
    return (
      <figure>
        <SmartImage ratio="16 / 9" placeholderLabel="Vídeo a adicionar" tint={2} className="rounded-xl" />
        <figcaption className="mt-2 text-sm opacity-70">{video.title}</figcaption>
      </figure>
    )
  }

  if (video.provider === 'file') {
    return (
      <figure>
        <video controls preload="none" poster={video.poster} className="aspect-video w-full rounded-xl bg-ink" aria-label={video.title}>
          <source src={video.source} />
        </video>
        {(video.caption || video.title) && <figcaption className="mt-2 text-sm opacity-80">{video.caption ?? video.title}</figcaption>}
      </figure>
    )
  }

  const poster = video.poster ?? (video.provider === 'youtube' ? `https://i.ytimg.com/vi/${video.source}/hqdefault.jpg` : undefined)

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-ink">
        {active ? (
          <iframe
            src={embedUrl(video)}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 grid place-items-center" aria-label={`Reproduzir vídeo: ${video.title}`}>
            {poster && <img src={poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />}
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-butter text-ink shadow-[0_4px_0_var(--color-cherry)] transition-transform group-hover:scale-105">
              <Icon name="play" size={26} fill="currentColor" />
            </span>
          </button>
        )}
      </div>
      {(video.caption || video.title) && <figcaption className="mt-2 text-sm opacity-80">{video.caption ?? video.title}</figcaption>}
    </figure>
  )
}
