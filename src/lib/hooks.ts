import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '../content/site'

let resumeCheck: Promise<boolean> | null = null

/**
 * Verifica se o PDF do currículo existe de fato. Hospedagens de SPA costumam devolver o
 * index.html para arquivos inexistentes (status 200), então conferimos o content-type.
 */
function checkResume() {
  resumeCheck ??= fetch(site.resumePath, { method: 'HEAD' })
    .then((r) => r.ok && (r.headers.get('content-type') ?? '').includes('pdf'))
    .catch(() => false)
  return resumeCheck
}

export function useResumeAvailable() {
  const [available, setAvailable] = useState(false)
  useEffect(() => {
    let alive = true
    checkResume().then((ok) => alive && setAvailable(ok))
    return () => {
      alive = false
    }
  }, [])
  return available
}

/** Copia um texto e mantém o estado "copiado" por alguns segundos. */
export function useCopy(timeout = 2200) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), timeout)
    },
    [timeout],
  )
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return { copied, copy }
}

export const isPlaceholderText = (text?: string) => !!text && /\[(A PREENCHER|A CONFIRMAR|ANO|NOME|FUNÇÃO|FERRAMENTA|ENTREGÁVEL|PEÇA|INSTITUIÇÃO)/.test(text)
