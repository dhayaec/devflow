"use client"

import { useEffect, useState, useCallback } from "react"

type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  referenceId: string | null
  referenceType: string | null
  isRead: boolean
  createdAt: string
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [totalUnread, setTotalUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=20")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setTotalUnread(data.totalUnread)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/notifications?limit=20")
        if (res.ok && !cancelled) {
          const data = await res.json()
          setNotifications(data.notifications)
          setTotalUnread(data.totalUnread)
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!userId) return

    const eventSource = new EventSource(`/api/notifications/sse?userId=${userId}`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.totalUnread !== undefined) {
          setTotalUnread(data.totalUnread)
        }
      } catch {
        // ignore heartbeat
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => eventSource.close()
  }, [userId])

  const markAsRead = useCallback(async (notificationId: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId }),
    })
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    )
    setTotalUnread((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setTotalUnread(0)
  }, [])

  return {
    notifications,
    totalUnread,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  }
}
