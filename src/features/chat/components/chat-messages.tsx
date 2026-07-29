"use client"

import { useEffect, useRef, useState } from "react"
import { useSocket } from "@/hooks/use-socket"
import { TypingIndicator } from "./typing-indicator"
import { MessageReactions } from "./message-reactions"

type User = { id: string; name: string | null; image: string | null }
type Reaction = { id: string; emoji: string; userId: string }
type Message = {
  id: string
  content: string
  userId: string
  user: User
  parentId: string | null
  isEdited: boolean
  isPinned: boolean
  createdAt: string
  reactions: Reaction[]
  replies?: Message[]
}

type TypingUser = { id: string; name: string }

export function ChatMessages({
  channelId,
  sessionUserId,
  initialMessages,
}: {
  channelId: string
  sessionUserId: string
  initialMessages: Message[]
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const { joinChannel, leaveChannel, onMessage, onMessageUpdated, onMessageRemoved, onTyping } =
    useSocket(sessionUserId)

  useEffect(() => {
    joinChannel(channelId)
    return () => leaveChannel(channelId)
  }, [channelId, joinChannel, leaveChannel])

  useEffect(() => {
    const unsubMessage = onMessage((msg) => {
      setMessages((prev) => [...prev, msg as Message])
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    })
    const unsubUpdate = onMessageUpdated((msg) => {
      setMessages((prev) => prev.map((m) => (m.id === (msg as Message).id ? (msg as Message) : m)))
    })
    const unsubRemove = onMessageRemoved((messageId) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
    })
    const unsubTyping = onTyping((data) => {
      if (data.user.id !== sessionUserId) {
        setTypingUsers((prev) => {
          const exists = prev.some((u) => u.id === data.user.id)
          if (exists) return prev
          return [...prev, data.user]
        })
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u.id !== data.user.id))
        }, 4000)
      }
    })

    return () => {
      unsubMessage?.()
      unsubUpdate?.()
      unsubRemove?.()
      unsubTyping?.()
    }
  }, [channelId, onMessage, onMessageUpdated, onMessageRemoved, onTyping, sessionUserId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [])

  if (messages.length === 0 && typingUsers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        No messages yet. Start a conversation.
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-3 group">
          <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
            {msg.user.name?.[0] ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium">{msg.user.name ?? "Unknown"}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {msg.isEdited && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
            {msg.reactions.length > 0 && (
              <MessageReactions reactions={msg.reactions} />
            )}
          </div>
        </div>
      ))}
      <TypingIndicator users={typingUsers} />
      <div ref={bottomRef} />
    </div>
  )
}
