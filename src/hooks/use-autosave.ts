import { useEffect, useRef } from "react"

export function useAutosave(
  save: () => Promise<void>,
  interval: number = 3000,
  key?: string,
) {
  const saveRef = useRef(save)
  const savingRef = useRef(false)

  useEffect(() => {
    saveRef.current = save
  }, [save])

  useEffect(() => {
    const timer = setInterval(() => {
      if (savingRef.current) return
      savingRef.current = true
      saveRef.current().finally(() => {
        savingRef.current = false
      })
    }, interval)

    return () => clearInterval(timer)
  }, [interval, key])
}
