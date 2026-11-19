import { useEffect } from 'react'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — SUTO` : 'SUTO — Threaded in Dhaka'
  }, [title])
}
