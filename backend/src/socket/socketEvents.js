export const SOCKET_EVENTS = {
    //Connection
    CONNECTION: "connection",
    DISCONNECT: "disconnect",

    //Room
    JOIN_ROOM: "join-room",
    LEAVE_ROOM: "leave-room",
    USER_JOINED: "user-joined",
    USER_LEFT: "user-left",
    ROOM_USERS: "room-users",
    ROOM_ENDED: "room-ended",

    //Web RTC
    OFFER: "offer",
    ANSWER: "answer",
    ICE_CANDIDATE: "ice-candidate",

    //Media
    MUTE: "mute",
    UNMUTE: "unmute",
    VIDEO_ON: "video-on",
    VIDEO_OFF: "video-off",
    SCREEN_SHARE_START: "screen-share-start",
    SCREEN_SHARE_STOP: "screen-share-stop",
    RAISE_HAND: "raise-hand",
    LOWER_HAND: "lower-hand",

    //chat message
    CHAT_MESSAGE: "chat-message",
    TYPING: "typing",
    STOP_TYPING: "stop_typing"
};