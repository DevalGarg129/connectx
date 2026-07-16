import roomManager from "./roomManager.js";
import { SOCKET_EVENTS } from "./socketEvents.js";
import socketAsyncHandler from "../socket/socketAsyncHandler.js";

//function for handloing duplicates
const removeParticipant = (socket) => {
    const roomId = socket.roomId;
    if(!roomId) return;

    roomManager.removeUser(roomId, socket.id);
    socket.leave(roomId);
    socket.to(roomId).emit(
        SOCKET_EVENTS.USER_LEFT,{
            socketId: socket.id,
            userId: socket.userId
        }
    );
};

const registerRoomEvents = (io, socket) => {
    //join room
    socket.on(
        SOCKET_EVENTS.JOIN_ROOM,
        socketAsyncHandler(async ({ roomId, userId, username }) => {
            if(!roomId || !userId || !username){
                return socket.emit("error", {
                    message: "Invalid room join request."
                });
            }
            socket.join(roomId);

            socket.data = {
                roomId,
                userId,
                username,
            };

            roomManager.addUser(roomId, socket, {
                userId,
                username
            });

            const participants = roomManager.getUsers(roomId);
            socket.emit(SOCKET_EVENTS.ROOM_USERS, participants);

            //notify everyone except sender 
            socket.to(roomId).emit(
                SOCKET_EVENTS.USER_JOINED,{
                    socketId: socket.id,
                    userId,
                    username
                }
            );
            console.log(`${username} joined room ${roomId}`);
        })
    );

    //leave room
    socket.on(
        SOCKET_EVENTS.LEAVE_ROOM,
        socketAsyncHandler(async () => {
            removeParticipant(socket);
        })
    );

    //disconnect
    socket.on(
        SOCKET_EVENTS.DISCONNECT,
        socketAsyncHandler(async () => {
            removeParticipant(socket);
        })
    );
};

export default registerRoomEvents;