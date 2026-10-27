import { useCallback, useEffect, useRef, useState } from 'react'
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
