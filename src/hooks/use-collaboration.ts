"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001"

interface OnlineUser {
  userId: string
  name: string
  image: string | null
}

interface CursorPosition {
  userId: string
  name: string
  color: string
  x: number
  y: number
}

interface KanbanMove {
  issueId: string
  projectId: string
  fromStatus: string
  toStatus: string
  newSortOrder: number
  userId: string
}

interface IssueChange {
  issueId: string
  projectId: string
  changes: Record<string, unknown>
  userId: string
}

export function useCollaboration(userId?: string, userName?: string, userImage?: string | null) {
  const socketRef = useRef<Socket | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    if (!userId) return

    const socket = io(SOCKET_URL, {
      query: { userId, userName, userImage },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
    })
    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [userId, userName, userImage])

  // --- Presence ---
  const joinOrg = useCallback((orgId: string) => {
    socketRef.current?.emit("presence:join-org", orgId)
  }, [])

  const leaveOrg = useCallback((orgId: string) => {
    socketRef.current?.emit("presence:leave-org", orgId)
  }, [])

  const onPresenceChange = useCallback(
    (handler: (users: OnlineUser[]) => void) => {
      socketRef.current?.on("presence:online", handler)
      return () => {
        socketRef.current?.off("presence:online", handler)
      }
    },
    [],
  )

  // --- Cursor Collaboration ---
  const joinDocument = useCallback((documentId: string) => {
    socketRef.current?.emit("cursor:join-document", documentId)
  }, [])

  const leaveDocument = useCallback((documentId: string) => {
    socketRef.current?.emit("cursor:leave-document", documentId)
  }, [])

  const broadcastCursor = useCallback(
    (documentId: string, x: number, y: number, color: string) => {
      socketRef.current?.emit("cursor:move", {
        documentId,
        userId,
        name: userName ?? "Unknown",
        color,
        x,
        y,
      })
    },
    [userId, userName],
  )

  const onCursorMove = useCallback(
    (handler: (cursor: CursorPosition) => void) => {
      socketRef.current?.on("cursor:moved", handler)
      return () => {
        socketRef.current?.off("cursor:moved", handler)
      }
    },
    [],
  )

  // --- Kanban Collaboration ---
  const joinProjectBoard = useCallback((projectId: string) => {
    socketRef.current?.emit("kanban:join-project", projectId)
  }, [])

  const leaveProjectBoard = useCallback((projectId: string) => {
    socketRef.current?.emit("kanban:leave-project", projectId)
  }, [])

  const broadcastKanbanMove = useCallback(
    (data: KanbanMove) => {
      socketRef.current?.emit("kanban:move", data)
    },
    [],
  )

  const onKanbanMove = useCallback(
    (handler: (move: KanbanMove) => void) => {
      socketRef.current?.on("kanban:moved", handler)
      return () => {
        socketRef.current?.off("kanban:moved", handler)
      }
    },
    [],
  )

  // --- Real-time Issue Updates ---
  const viewIssue = useCallback((issueId: string) => {
    socketRef.current?.emit("issue:view", { issueId, userId })
  }, [userId])

  const stopViewingIssue = useCallback((issueId: string) => {
    socketRef.current?.emit("issue:stop-viewing", { issueId })
  }, [])

  const broadcastIssueUpdate = useCallback(
    (issueId: string, projectId: string, changes: Record<string, unknown>) => {
      socketRef.current?.emit("issue:updated", { issueId, projectId, changes, userId })
    },
    [userId],
  )

  const onIssueChanged = useCallback(
    (handler: (change: IssueChange) => void) => {
      socketRef.current?.on("issue:changed", handler)
      return () => {
        socketRef.current?.off("issue:changed", handler)
      }
    },
    [],
  )

  const setOnlineUsersFromEvent = useCallback((users: OnlineUser[]) => {
    setOnlineUsers(users)
  }, [])

  return {
    onlineUsers,
    setOnlineUsers: setOnlineUsersFromEvent,
    presence: { joinOrg, leaveOrg, onPresenceChange },
    cursor: { joinDocument, leaveDocument, broadcastCursor, onCursorMove },
    kanban: { joinProjectBoard, leaveProjectBoard, broadcastKanbanMove, onKanbanMove },
    issue: { viewIssue, stopViewingIssue, broadcastIssueUpdate, onIssueChanged },
  }
}
