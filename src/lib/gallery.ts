import { useCallback, useEffect, useState } from 'react'
import type { Gallery } from './gallery-types'

/**
 * Carrega a galeria: primeiro os dados salvos pelo admin (/api/gallery); se ainda não
 * houver nada salvo — ou se o site estiver rodando sem as funções do servidor —
 * usa a galeria inicial que acompanha o site (public/galeria-inicial.json).
 */
export async function loadGallery(): Promise<Gallery> {
  try {
    const res = await fetch('/api/gallery', { cache: 'no-store' })
    if (res.ok && res.headers.get('content-type')?.includes('json')) {
      const { gallery } = (await res.json()) as { gallery: Gallery | null }
      if (gallery) return gallery
    }
  } catch {
    /* sem servidor: segue para a galeria inicial */
  }
  const res = await fetch('/galeria-inicial.json')
  return res.ok ? ((await res.json()) as Gallery) : { niches: [], photos: [] }
}

export function useGallery() {
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [error, setError] = useState(false)
  const reload = useCallback(() => {
    loadGallery()
      .then((g) => {
        setGallery(g)
        setError(false)
      })
      .catch(() => setError(true))
  }, [])
  useEffect(reload, [reload])
  return { gallery, error, reload, setGallery }
}

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** "2026-08-07" → "7 ago 2026". */
export function formatDate(date?: string) {
  if (!date) return ''
  const [y, m, d] = date.split('-').map(Number)
  return `${d} ${months[m - 1]} ${y}`
}
