import { useLocation } from 'react-router'
import { site } from '../../content/site'
import { SITE_URL } from '../../lib/env'

interface Props {
  title?: string
  description?: string
  image?: string
  noindex?: boolean
}

/** Título, descrição e canonical por página (o React 19 move essas tags para o <head>). */
export function Seo({ title, description = site.description, image, noindex }: Props) {
  const { pathname } = useLocation()
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} — ${site.role}`
  const url = `${SITE_URL}${pathname === '/' ? '' : pathname}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url || '/'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image.startsWith('http') ? image : `${SITE_URL}${image}`} />}
      {noindex && <meta name="robots" content="noindex" />}
    </>
  )
}
