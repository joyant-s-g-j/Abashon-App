import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)

const allowedOrigins = process.env.FRONTEND_URLS.split(',');

const io = new Server(server, {
    cors: {
        origin: allowedOrigins
    }
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    if(userId) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export { io, app, server }