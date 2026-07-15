import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";
import { Room } from "../models/room.model.js";
import httpStatus from "http-status";
import generateRoomId from "../utils/roomIdGenerator.js";

//Controller for Creating Room
export const createRoom = async (req, res) => {
    try{
        const hostId = req.user.id;
        const roomId = generateRoomId();
        
        const room = await Room.create({
            room,
            host: hostId,
            participants: [{
                user: hostId,
                role: "HOST"
            }],
            status: "ACTIVE",
            startedAt: new Date()
        });

        return res.status(httpStatus.CREATED).json({
            success: true,
            message: "Room Created Successfull"
        });
    }catch(error){
        console.log(`Error while Room Creating: ${error.message}`);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

//Controller for Joining Room
export const joinRoom = async(req, res) => {
    try{
        const { roomId } = req.params;
        const userId = req.user.id;
        const room = await Room.findOne({
            roomId
        });

        // Room not found
        if(!room){
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "Room Not Found"
            });
        }

        // Room Ended Already
        if(room.status === "ENDED"){
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "Meeting Already Ended"
            });
        }

        // Room is Locked
        if(room.settings.roomLocked){
            return res.status(httpStatus.FORBIDDEN).json({
                success: false,
                message: "Room is Locked"
            });
        }

        // Room is Full
        if(room.participants.length >= room.settings.maxParticipants){
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "Room is full"
            })
        }

        if(isParticipant(room.participants, userId)){
            return res.status(httpStatus.OK).json({
                success: true,
                message: "Already Joined",
                room
            });
        }

        room.participants.push({
            user: userId
        });

        await room.save();

        return res.status(httpStatus.OK).json({
            success: true,
            message: "Room Joined Successfully"
        });
    }catch(error){
        console.log(`Error During Join: ${error.message}`);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
};

//Leaving Room Controller
export const leaveRoom = async (req, res) => {
    try{
        const { roomId } = req.params;
        const userId = req.user.id;

        const room = await Room.findOne({ roomId });
        if(!room){
            res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "Room Not Found"
            });
        }

        room.participants = room.participants.filter(
            participant => 
            participant.user.toString() !== userId.toString()
        );

        if(room.participants.length === 0){
            await room.deleteOne();
            return res.status(httpStatus.OK).json({
                success: true,
                message: "Room Deleted Successfully"
            });
        }

        if(room.host.toString() === userId.host.toString()){
            room.host = room.participants[0].user;
            room.participants[0].role = "HOST";
        }

        await room.save();
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Room Left Successfully"
        })
    }catch(error){
        console.log(`Error while leaving the meeting: ${error.message}`);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}

//Controller for getting room
export const getRoom = async(req, res) => {
    try{
        const room = await Room.findOne({
            roomId: req.params.roomId
        })
        .populate("host", "name email")
        .populate("participant.user", "name email")

        if(!room){
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "Room not Found"
            });
        }

        return res.status(httpStatus.OK).json({
            success: true,
            room
        });
    }catch(error){
        console.log(`Error Getting Room : ${error.message}`);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

//Controller for Getting My rooms
export const getMyRooms = async (req, res) => {
    try{
        const rooms = await Room.find({
            host: req.user.id
        }).sort({
            createdAt: -1
        });

        return res.status(httpStatus.OK).json({
            success: true,
            rooms,
            message: "Got the Rooms"
        })
    }catch(error){
        console.log(`Error Getting Rooms : ${error.message}`);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

//Controller for updating Room Settings
export const updateRoomSettings = async(req, res) => {
    try{
        const room = await Room.findOne({ 
            roomId: req.params.roomId
        });
        if(!room){
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "Room Not Found"
            });
        }
        if(room.host.toString() !== req.user.id){
            return res.status(httpStatus.FORBIDDEN).json({
                success: false,
                message: "Only host can update Settings"
            });
        }

        room.settings = {
            ...room.settings.toObject(),
            ...req.body
        };
        await room.save();
        return res.status(httpStatus.OK).json({
            success: true,
            room
        });
    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

export const endRoom = async(req, res) => {
    try{
        const room = await Room.findOne({
            roomId: req.params.roomId
        });

        if(!room){
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "Room Not Found"
            });
        }

        if(room.host.toString() !== req.user.id){
            return res.status(httpStatus.FORBIDDEN).json({
                success: false,
                message: "Only host can end room"
            });
        }

        room.status = "ENDED";
        room.endedAt = Date.now();
        await room.save();

        return res.status(httpStatus.OK).json({
            success: true,
            message: "Meeting Ended"
        });
    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteRoom = async (req, res) => {
    try{
        const room = await Room.findOne({
            roomId: req.params.roomId
        });

        if(!room){
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "Room Not Found"
            });
        }

        await room.deleteOne();
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Room Deleted Successfully"
        });
    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}