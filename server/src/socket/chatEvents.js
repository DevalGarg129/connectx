import { SOCKET_EVENTS } from "./socketEvents.js";
import socketAsyncHandler from "./socketAsyncHandler.js";

const broadcast = (socket, event, payload = {}) => {
    socket.to(socket.data.roomId).emit(event, {
        socketId: socket.id,
        userId: socket.data.userId,
        username: socket.data.username,
        timestamp: Date.now(),
        ...payload
    });
};

const registerChatEvents = (io, socket) => {
    //Chat Message
    socket.on(
        SOCKET_EVENTS.CHAT_MESSAGE,
        socketAsyncHandler(async ({ message }) => {
            broadcast(
                socket,
                SOCKET_EVENTS.CHAT_MESSAGE,
                { message }
            );
        })         
    );

    //Typing
    socket.on(
        SOCKET_EVENTS.TYPING,
        socketAsyncHandler(async () => {
            broadcast(
                socket,
                SOCKET_EVENTS.TYPING
            );
        })
    );

    //Stop Typing
    socket.on(
        SOCKET_EVENTS.STOP_TYPING,
        socketAsyncHandler(async () => {
            broadcast(
                socket,
                SOCKET_EVENTS.STOP_TYPING
            );
        })
    )
};

export default registerChatEvents;