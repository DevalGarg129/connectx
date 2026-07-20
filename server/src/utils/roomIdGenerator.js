import crypto from "crypto";

const generateRoomId = () => {
    return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export default generateRoomId;