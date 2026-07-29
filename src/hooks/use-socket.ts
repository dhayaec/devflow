"use client"

import { useEffect, useRef, useCallback } from "react"
import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001"

let globalSocket: Socket | null = null

function getSocket(userId: string): Socket {
  if (!globalSocket?.connected) {
    globalSocket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
    })
  }
  return globalSocket
}

export function useSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!userId) return

    const socket = getSocket(userId)
    socketRef.current = socket

    return () => {
      // Don't disconnect — socket persists for other hooks
    }
  }, [userId])

  const joinChannel = useCallback((channelId: string) => {
    socketRef.current?.emit("join-channel", channelId)
  }, [])

  const leaveChannel = useCallback((channelId: string) => {
    socketRef.current?.emit("leave-channel", channelId)
  }, [])

  const sendMessage = useCallback(
    (channelId: string, message: Record<string, unknown>) => {
      socketRef.current?.emit("message:send", { channelId, message })
    },
    [],
  )

  const editMessage = useCallback(
    (channelId: string, message: Record<string, unknown>) => {
      socketRef.current?.emit("message:edit", { channelId, message })
    },
    [],
  )

  const deleteMessage = useCallback(
    (channelId: string, messageId: string) => {
      socketRef.current?.emit("message:delete", { channelId, messageId })
    },
    [],
  )

  const startTyping = useCallback(
    (channelId: string, user: { id: string; name: string }) => {
      socketRef.current?.emit("typing:start", { channelId, user })
    },
    [],
  )

  const stopTyping = useCallback(
    (channelId: string, userId: string) => {
      socketRef.current?.emit("typing:stop", { channelId, userId })
    },
    [],
  )

  const onMessage = useCallback(
    (handler: (message: Record<string, unknown>) => void) => {
      socketRef.current?.on("message:new", handler)
      return () => {
        socketRef.current?.off("message:new", handler)
      }
    },
    [],
  )

  const onMessageUpdated = useCallback(
    (handler: (message: Record<string, unknown>) => void) => {
      socketRef.current?.on("message:updated", handler)
      return () => {
        socketRef.current?.off("message:updated", handler)
      }
    },
    [],
  )

  const onMessageRemoved = useCallback(
    (handler: (messageId: string) => void) => {
      socketRef.current?.on("message:removed", handler)
      return () => {
        socketRef.current?.off("message:removed", handler)
      }
    },
    [],
  )

  const onTyping = useCallback(
    (handler: (data: { channelId: string; user: { id: string; name: string } }) => void) => {
      socketRef.current?.on("typing", handler)
      return () => {
        socketRef.current?.off("typing", handler)
      }
    },
    [],
  )

  return {
    joinChannel,
    leaveChannel,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    stopTyping,
    onMessage,
    onMessageUpdated,
    onMessageRemoved,
    onTyping,
  }
}
