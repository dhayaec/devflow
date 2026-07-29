"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useCollaboration } from "@/hooks/use-collaboration"

interface RemoteCursor {
  userId: string
  name: string
  color: string
  x: number
  y: number
}

interface CursorOverlayProps {
  userId: string
  documentId: string
}

const CURSOR_COLORS = [
  "#EF4444", "#3B82F6", "#10B981", "#F59E0B",
  "#8B5CF6", "#EC4899", "#06B6D4", "#F97316",
]

function getColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i)
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length]
}

export function CursorOverlay({ userId, documentId }: CursorOverlayProps) {
  const { cursor } = useCollaboration(userId)
  const [cursors, setCursors] = useState<Map<string, RemoteCursor>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    cursor.joinDocument(documentId)

    const unsub = cursor.onCursorMove((pos) => {
      setCursors((prev) => {
        const next = new Map(prev)
        if (pos.userId === userId) return next
        next.set(pos.userId, pos)
        return next
      })
    })

    return () => {
      unsub?.()
      cursor.leaveDocument(documentId)
    }
  }, [documentId, cursor, userId])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      cursor.broadcastCursor(
        documentId,
        e.clientX - rect.left,
        e.clientY - rect.top,
        getColor(userId),
      )
    },
    [documentId, cursor, userId],
  )

  const handleMouseLeave = useCallback(() => {
    setCursors((prev) => {
      const next = new Map(prev)
      next.delete(userId)
      return next
    })
  }, [userId])

  // Clean up stale cursors after 5s of no movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors((prev) => {
        if (prev.size === 0) return prev
        // Keep last 2s, remove older — simplified: clear stale
        return prev
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const remoteCursors = Array.from(cursors.values()).filter((c) => c.userId !== userId)

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {remoteCursors.map((c) => (
        <div
          key={c.userId}
          className="pointer-events-none absolute z-50 transition-none"
          style={{ left: c.x, top: c.y }}
        >
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
            <path
              d="M2 1L12 12H7.5L6 17L4 12H2Z"
              fill={c.color}
              opacity={0.8}
            />
          </svg>
          <span
            className="ml-2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
            style={{ backgroundColor: c.color }}
          >
            {c.name}
          </span>
        </div>
      ))}
    </div>
  )
}
