import express from "express"
import http from "http"
import { Server } from "socket.io"
import { v4 as uuidv4 } from "uuid"

const app = express()
const server = http.createServer(app)

const allowedOrigins = process.env.FRONTEND_URLS;

const io = new Server(server, {
    cors: {
        origin: allowedOrigins
    }
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {}
const callRooms = new Map()
const userSockets = new Map()

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    if(userId) {
        userSocketMap[userId] = socket.id
        userSockets.set(userId, socket.id)
        socket.userId = userId
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    // chat functionality
    socket.on("disconnect", () => {
        if(userId) {
            delete userSocketMap[userId]
            userSockets.delete(userId)
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })

    // audio call functionality
    socket.on('initiate-call', ({ callerId, receiverId, callerName, callerAvatar }) => {
        console.log(`Call initiated by ${callerName} to ${receiverId}`);

        const receiverSocketId = userSockets.get(receiverId)
        if(receiverSocketId) {
            const callId = uuidv4()

            callRooms.set(callId, {
                caller: callerId,
                receiverId: receiverId,
                status: 'ringing',
                createdAt: new Date()
            });

            console.log(`Call room created: ${callId}`);

            io.to(receiverSocketId).emit('incoming-call', {
                callId,
                callerId,
                callerName,
                callerAvatar,
                type: 'audio'
            });

            socket.emit('call-initiated', { callId })
        } else {
            console.log(`User ${receiverId} is offline`);
            socket.emit('user-offline', { receiverId });
        }
    });

    socket.on('accept-call', ({ callId }) => {
        console.log(`Call accepted: ${callId}`);

        const callRoom = callRooms.get(callId);
        if(callRoom) {
            callRoom.status = 'accepted';
            callRoom.acceptedAt = new Date()

            const callerSocketId = userSockets.get(callRoom.caller)

            if(callerSocketId) {
                io.to(callerSocketId).emit('call-accepted', { callId })
            }
        }
    });

    socket.on('reject-call', ({ callId }) => {
        console.log(`Call rejected: ${callId}`);

        const callRoom = callRooms.get(callId);
        if(callRoom) {
            const callerSocketId = userSockets.get(callRoom.caller)

            if(callerSocketId) {
                io.to(callerSocketId).emit('call-rejected', { callId });
            }

            callRooms.delete(callId)
        }
    });

    socket.on('end-call', ({ callId }) => {
        console.log(`Call ended: ${callId}`);

        const callRoom = callRooms.get(callId);
        if(callRoom) {
            const callerSocketId = userSockets.get(callRoom.caller);
            const receiverSocketId = userSockets.get(callRoom.receiver)

            if(callerSocketId) {
                io.to(callerSocketId).emit('call-ended', { callId })
            }
            if(receiverSocketId) {
                io.to(receiverSocketId).emit('call-ended', { callId })
            }

            callRooms.delete(callId)
        }
    });

    socket.on('offer', ({ callId, offer }) => {
        console.log(`Offer received for call: ${callId}`);

        const callRoom = callRooms.get(callId);
        if(callRoom) {
            const receiverSocketId = userSockets.get(callRoom.receiver)
            if(receiverSocketId) {
                io.to(receiverSocketId).emit('offer', { callId, offer })
            }
        }
    });

    socket.on('answer', ({ callId, answer }) => {
        console.log(`Answer received for call: ${callId}`);

        const callRoom = callRooms.get(callId);
        if(callRoom) {
            const callerSocketId = userSockets.get(callRoom.caller)
            if(callerSocketId) {
                io.to(callerSocketId).emit('answer', { callId, answer })
            }
        }
    });

    socket.on('ice-cadidate', ({ callId, candidate }) => {
        console.log(`ICE candidate received for call: ${callId}`);

        const callRoom = callRooms.get(callId);
        if(callRoom) {
            const targetSocketId = socket.userId === callRoom.caller
                ? userSockets.get(callRoom.receiver)
                : userSockets.get(callRoom.caller)
            
            if(targetSocketId) {
                io.to(targetSocketId).emit('ice-candidate', { callId, candidate })
            }
        }
    });

    socket.on('call-connected', ({ callId }) => {
        console.log(`Call connected: ${callId}`);

        const callRoom = callRooms.get(callId);
        if(callRoom) {
            callRoom.status = 'connected';
            callRoom.connectedAt = new Date()
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);

        if(userId) {
            delete userSocketMap[userId]
            userSockets.delete(userId)

            for(const [callId, callRoom] of callRooms.entries()) {
                if(callRoom.caller === userId || callRoom.receiver === userId) {
                    const otherUserId = callRoom.caller === userId ? callRoom.receiver : callRoom.caller;
                    const otherSocketId = userSockets.get(otherUserId);

                    if(otherSocketId) {
                        io.to(otherSocketId).emit('call-ended', { callId, reason: 'user_disconnected' })
                    }

                    callRooms.delete(callId)
                }
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export function getActiveCallsCount() {
    return callRooms.size
}

export function getCallInfo(callId) {
    return callRooms.get(callId)
}

export function isUserInCall(userId) {
    for(const callRoom of callRooms.values()) {
        if(callRoom.caller === userId || callRoom.receiver === userId) {
            return true
        }
    }
    return false
}

export { io, app, server }