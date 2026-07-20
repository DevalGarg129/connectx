import socketAsyncHandler from "../socket/socketAsyncHandler.js";
import { SOCKET_EVENTS } from "./socketEvents.js";

const registerSignalingEvents = (io, socket) => {
    //Offer
    socket.on(
        SOCKET_EVENTS.OFFER,
        socketAsyncHandler(async (data) => {
            const { targetSocketId, offer } = data;
            io.to(targetSocketId).emit(
                SOCKET_EVENTS.OFFER,{
                    offer,
                    from: socket.id,
                    userId: socket.data.userId,
                    username: socket.data.username
                }
            )
        })
    )

    //answer
    socket.on(
        SOCKET_EVENTS.ANSWER,
        socketAsyncHandler(async (data) => {
            const { targetSocketId, answer } = data;
            io.to(targetSocketId).emit(
                SOCKET_EVENTS.ANSWER,{
                    answer,
                    from: socket.id,
                    userId: socket.data.userId,
                    username: socket.data.username
                }
            )
        })
    );

    //Ice Candidate
    socket.on(
        SOCKET_EVENTS.ICE_CANDIDATE,
        socketAsyncHandler(async (data) => {
            const { targetSocketId, candidate } = data;
            io.to(targetSocketId).emit(
                SOCKET_EVENTS.ICE_CANDIDATE,{
                    candidate,
                    from: socket.id
                }
            )
        })
    );
};
//Ques why SocketIds instead of userId
export default registerSignalingEvents;