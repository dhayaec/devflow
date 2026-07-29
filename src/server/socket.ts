import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

const userSockets = new Map<string, Set<string>>()
const presenceCache = new Map<string, { userId: string; name: string; image: string | null }[]>()

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string
  const userName = socket.handshake.query.userName as string | undefined
  const userImage = socket.handshake.query.userImage as string | undefined
  if (!userId) {
    socket.disconnect()
    return
  }

  // --- Presence ---
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set())
  }
  userSockets.get(userId)!.add(socket.id)

  socket.join(`user:${userId}`)

  socket.on("presence:join-org", (orgId: string) => {
    socket.join(`org:${orgId}`)
    socket.data.orgId = orgId

    const user = { userId, name: userName ?? "Unknown", image: userImage ?? null }
    const members = presenceCache.get(orgId) ?? []
    if (!members.some((m) => m.userId === userId)) {
      members.push(user)
      presenceCache.set(orgId, members)
    }
    io.to(`org:${orgId}`).emit("presence:online", members)
  })

  socket.on("presence:leave-org", (orgId: string) => {
    socket.leave(`org:${orgId}`)
    const members = presenceCache.get(orgId) ?? []
    const filtered = members.filter((m) => m.userId !== userId)
    if (filtered.length > 0) {
      presenceCache.set(orgId, filtered)
    } else {
      presenceCache.delete(orgId)
    }
    io.to(`org:${orgId}`).emit("presence:online", filtered)
  })

  // --- Channel Chat (existing) ---
  socket.on("join-channel", (channelId: string) => {
    socket.join(`channel:${channelId}`)
  })

  socket.on("leave-channel", (channelId: string) => {
    socket.leave(`channel:${channelId}`)
  })

  socket.on(
    "message:send",
    (data: { channelId: string; message: Record<string, unknown> }) => {
      socket.to(`channel:${data.channelId}`).emit("message:new", data.message)
    },
  )

  socket.on(
    "message:edit",
    (data: { channelId: string; message: Record<string, unknown> }) => {
      socket.to(`channel:${data.channelId}`).emit("message:updated", data.message)
    },
  )

  socket.on(
    "message:delete",
    (data: { channelId: string; messageId: string }) => {
      socket.to(`channel:${data.channelId}`).emit("message:removed", data.messageId)
    },
  )

  socket.on("typing:start", (data: { channelId: string; user: { id: string; name: string } }) => {
    socket.to(`channel:${data.channelId}`).emit("typing", data)
  })

  socket.on("typing:stop", (data: { channelId: string; userId: string }) => {
    socket.to(`channel:${data.channelId}`).emit("typing:stopped", data)
  })

  // --- Cursor Collaboration ---
  socket.on(
    "cursor:move",
    (data: { documentId: string; userId: string; name: string; color: string; x: number; y: number }) => {
      socket.to(`document:${data.documentId}`).emit("cursor:moved", data)
    },
  )

  socket.on("cursor:join-document", (documentId: string) => {
    socket.join(`document:${documentId}`)
  })

  socket.on("cursor:leave-document", (documentId: string) => {
    socket.leave(`document:${documentId}`)
  })

  // --- Kanban Collaboration ---
  socket.on(
    "kanban:move",
    (data: {
      issueId: string
      projectId: string
      fromStatus: string
      toStatus: string
      newSortOrder: number
      userId: string
    }) => {
      socket.to(`project:${data.projectId}`).emit("kanban:moved", data)
    },
  )

  socket.on("kanban:join-project", (projectId: string) => {
    socket.join(`project:${projectId}`)
  })

  socket.on("kanban:leave-project", (projectId: string) => {
    socket.leave(`project:${projectId}`)
  })

  // --- Real-time Issue Updates ---
  socket.on(
    "issue:updated",
    (data: { issueId: string; projectId: string; changes: Record<string, unknown>; userId: string }) => {
      socket.to(`project:${data.projectId}`).emit("issue:changed", data)
    },
  )

  socket.on(
    "issue:view",
    (data: { issueId: string; userId: string }) => {
      socket.join(`issue:${data.issueId}`)
    },
  )

  socket.on(
    "issue:stop-viewing",
    (data: { issueId: string }) => {
      socket.leave(`issue:${data.issueId}`)
    },
  )

  // --- Disconnect ---
  socket.on("disconnect", () => {
    const orgId = socket.data.orgId as string | undefined
    if (orgId) {
      const members = presenceCache.get(orgId) ?? []
      const filtered = members.filter((m) => m.userId !== userId)
      if (filtered.length > 0) {
        presenceCache.set(orgId, filtered)
      } else {
        presenceCache.delete(orgId)
      }
      io.to(`org:${orgId}`).emit("presence:online", filtered)
    }

    const sockets = userSockets.get(userId)
    if (sockets) {
      sockets.delete(socket.id)
      if (sockets.size === 0) userSockets.delete(userId)
    }
  })
})

const PORT = parseInt(process.env.SOCKET_PORT ?? "3001")
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

export { io }
