// Create Socket.IO Server

// ↓

// Authenticate Socket (later)

// ↓

// Register Room Events

// ↓

// Register Signaling Events

// ↓

// Register Media Events

// ↓

// Register Chat Events
import { Server } from "socket.io";
import { SOCKET_EVENTS } from "./socketEvents.js";

import socketAsyncHandler from "./socketAsyncHandler";
import registerRoomEvents from "./roomEvents.js";
import registerSignalingEvents from "./signalingEvents.js";
import registerMediaEvents from "./mediaEvents.js";
import registerChatEvents from "./chatEvents.js";

const activeRooms = new Map();
let io = null;

const initializeSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
        console.log(`Socket Connected: ${socket.id}`);
        
        //Join room
        registerRoomEvents(io, socket);

        registerSignalingEvents(io, socket);

        registerChatEvents(io, socket);

        registerMediaEvents(io, socket);
    });
    return io;
};

export default initializeSocket;
export { io };