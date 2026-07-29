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

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string
  if (!userId) {
    socket.disconnect()
    return
  }

  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set())
  }
  userSockets.get(userId)!.add(socket.id)

  socket.join(`user:${userId}`)

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

  socket.on("disconnect", () => {
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
