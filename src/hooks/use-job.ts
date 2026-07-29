"use client"

import { useState, useEffect, useCallback } from "react"

interface JobEvent {
  type: "connected" | "progress" | "complete" | "error" | "cancelled"
  jobId?: string
  progress?: number
  log?: string
  result?: unknown
  error?: string
}

interface JobState {
  status: "idle" | "running" | "completed" | "failed" | "cancelled"
  progress: number
  logs: string[]
  result?: unknown
  error?: string
}

export function useJob() {
  const [jobId, setJobId] = useState<string | null>(null)
  const [state, setState] = useState<JobState>({
    status: "idle",
    progress: 0,
    logs: [],
  })

  const subscribe = useCallback((id: string, endpoint: "deployments" | "import" | "export") => {
    setJobId(id)
    setState({ status: "running", progress: 0, logs: [] })

    const eventSource = new EventSource(`/api/sse/${endpoint}?jobId=${id}`)

    eventSource.onmessage = (event) => {
      try {
        const data: JobEvent = JSON.parse(event.data)

        switch (data.type) {
          case "connected":
            break
          case "progress":
            setState((prev) => ({
              ...prev,
              progress: data.progress ?? prev.progress,
              logs: data.log ? [...prev.logs, data.log] : prev.logs,
            }))
            break
          case "complete":
            setState((prev) => ({
              ...prev,
              status: "completed",
              progress: 100,
              result: data.result,
              logs: [...prev.logs, "Complete"],
            }))
            eventSource.close()
            break
          case "error":
            setState((prev) => ({
              ...prev,
              status: "failed",
              error: data.error,
            }))
            eventSource.close()
            break
          case "cancelled":
            setState((prev) => ({
              ...prev,
              status: "cancelled",
            }))
            eventSource.close()
            break
        }
      } catch {
        // ignore heartbeat
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => eventSource.close()
  }, [])

  const reset = useCallback(() => {
    setJobId(null)
    setState({ status: "idle", progress: 0, logs: [] })
  }, [])

  return { jobId, state, subscribe, reset }
}
