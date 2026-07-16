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
import socketAsyncHandler from "./socketAsyncHandler";

const activeRooms = new Map();
const initializeSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("Connection", (socket) => {
        console.log(`Socket Connected: ${socket.id}`);
        socket.io("disconnect", () => {
            console.log('Socket disconnected : ${socket.id}');
        });

        //Join room
        // socket.io("join-room", socketAsyncHandler(async({ roomId, userId })) => {
        //     const room = await Room.findOne({ roomId });
        // });
        //leave-room

        //offer

        //answer

        //ice-candidate

        //chat

        //screen-share

        //mute

        //disconnect
    });

    return io;
};

export default initializeSocket;