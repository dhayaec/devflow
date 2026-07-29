import { useEffect, useRef } from "react"

export function useAutosave(
  save: () => Promise<void>,
  interval: number = 3000,
  key?: string,
) {
  const saveRef = useRef(save)
  saveRef.current = save

  useEffect(() => {
    const timer = setInterval(() => {
      saveRef.current()
    }, interval)

    return () => clearInterval(timer)
  }, [interval, key])
}
