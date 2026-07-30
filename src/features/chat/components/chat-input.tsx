"use client"

import { useState, useRef, useCallback } from "react"
import { useSocket } from "@/hooks/use-socket"

export function ChatInput({
  channelId,
  sessionUserId,
  sessionUserName,
}: {
  channelId: string
  sessionUserId: string
  sessionUserName: string | null
}) {
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { startTyping, stopTyping } = useSocket(sessionUserId)

  const handleTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    } else {
      startTyping(channelId, { id: sessionUserId, name: sessionUserName ?? "Unknown" })
    }
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(channelId, sessionUserId)
      typingTimeoutRef.current = null
    }, 2000)
  }, [channelId, sessionUserId, sessionUserName, startTyping, stopTyping])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || sending) return

    setSending(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim(), channelId }),
      })
      if (!res.ok) throw new Error("Failed to send")
      setText("")
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
      stopTyping(channelId, sessionUserId)
    } catch {
      // silently fail — message will appear on refresh
    } finally {
      setSending(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="p-3 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            handleTyping()
          }}
          placeholder="Type a message..."
          className="flex-1 h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  )
}
