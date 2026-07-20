import { SOCKET_EVENTS } from "./socketEvents.js";
import socketAsyncHandler from "./socketAsyncHandler.js";

const broadcast = (socket, event, extra = {}) => {
    socket.to(socket.data.roomId).emit(event, {
        socketId: socket.id,
        userId: socket.data.userId,
        username: socket.data.username,
        ...extra
    });
};

//Neccessary Media Events
const registerMediaEvents = (io, socket) => {
    //mute
    socket.on(
        SOCKET_EVENTS.MUTE,
        socketAsyncHandler(async, () => {
            broadcast(socket, SOCKET_EVENTS.MUTE)
        })
    );

    //unmute
    socket.on(
        SOCKET_EVENTS.UNMUTE,
        socketAsyncHandler(async, () => {
            broadcast(socket, SOCKET_EVENTS.UNMUTE);
        })
    );

    //video on
    socket.on(
        SOCKET_EVENTS.VIDEO_ON,
        socketAsyncHandler(async, () => {
            broadcast(socket, SOCKET_EVENTS.VIDEO_ON);
        })
    );

    //video off
    socket.on(
        SOCKET_EVENTS.VIDEO_OFF, 
        socketAsyncHandler(async, () => {
            broadcast(socket, SOCKET_EVENTS.VIDEO_OFF);
        })
    );

    //screen share start
    socket.on(
        SOCKET_EVENTS.SCREEN_SHARE_START,
        socketAsyncHandler(async, () => {
            broadcast(socket, SOCKET_EVENTS.SCREEN_SHARE_START);
        })
    );

    //screen share stop
    socket.on(
        SOCKET_EVENTS.SCREEN_SHARE_STOP,
        socketAsyncHandler(async, () => {
            broadcast(socket, SOCKET_EVENTS.SCREEN_SHARE_STOP);
        })
    );

    //raise hand
    socket.on(
        SOCKET_EVENTS.RAISE_HAND,
        socketAsyncHandler(async, () => {
            broadcast(socket, SOCKET_EVENTS.RAISE_HAND);
        })
    );

    //lower hand
    socket.on(
        SOCKET_EVENTS.LOWER_HAND,
        socketAsyncHandler(async, () => {
            broadcast(socket, SOCKET_EVENTS.LOWER_HAND);
        })
    );
};

export default registerMediaEvents;