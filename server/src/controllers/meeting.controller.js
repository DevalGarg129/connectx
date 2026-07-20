import { Meeting } from "../models/meeting.model.js";
import crypto from "crypto";

//create meeting controller
export const createMeeting = async (req, res) => {
    try{
        const { title } = req.body;
        const meetingCode = crypto.randomUUID();

        const meeting = await Meeting.create({
            meetingCode, 
            title: title || "Untitled Meeting",
            host: req.user.id,
            participants: [req.user.id],
            isActive: true,
            startedAt: new Date()
        });

        return res.status(201).json({ 
            success: true, 
            message: "Meeting Created Successfully ", 
            data: meeting
        });

    }catch(error){
        console.error(`Error getting while creating the Meeting : ${error.message}`);
        return res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: error.stack
        });
    }
}

//join meeting controller
export const joinMeeting = async (req, res) => {
    try{
        const { meetingCode } = req.params;

        const meeting = await Meeting.findOne({
            meetingCode,
            isActive: true
        });

        if(!meeting){
            return res.status(404).json({
                success: false,
                message: "Message Not found"
            });
        }

        const alreadyJoined = meeting.participants.includes(req.user.id);
        if(!alreadyJoined){
            meeting.participants.push(req.params.id);
            await meeting.save();
        }
        return res.status(200).json({
            success: true,
            message: "Meeting joined successfully",
            data: meeting
        });
    }catch(error){
        console.log(`Error while joining the meeting : ${error.message}`);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//leave meeting controller
export const leaveMeeting = async (req, res) => {
    try{
        const { meetingCode } = req.params;

        const meeting = await Meeting.findOne({ 
            meetingCode,
            isActive: true
        });

        if(!meeting){
            return res.status(404).json({
                success: false,
                message: "meeting not found"
            });
        }

        meeting.participants = meeting.participants.filter(
            (user) => user.toString() !== req.user.id
        );

        await Meeting.save();

        return res.status(200).json({
            success: true,
            message: "User left Meeting"
        });
    }catch(error){
        console.log(`Error while leaving the Meeting : ${error.message}`);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//end meeting controller
export const endMeeting = async (req, res) => {
    try{
        const { meetingCode } = req.params;

        const meeting = await Meeting.findOne({
            meetingCode,
            isActive: true
        });

        if(!meeting){
            return res.status(404).json({
                success: false,
                message: "Meeting Not found"
            });
        }

        if(meeting.host.toString() !== req.user.id){
            return res.status(403).json({
                success: false,
                message: "Only host can end the meeting"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Meeting Ended Successfully"
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

//get Meeting details controller
export const getMeeting = async (req, res) => {
    try{
        const { meetingCode } = req.params;
        const meeting = await Meeting.findOne({
            meetingCode,
            isActive: true
        })
        .populate('host', 'name email')
        .populate('participants', 'name email')

        if(!meeting){
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            })
        }
        return res.status(200).json({
            success: true,
            data: meeting,
            message: "Meeting Found using Code"
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

//Get logged in user Meeting
export const getMyMeetings = async (req, res) => {
    try{
        const meetings = await Meeting.find({
            host: req.user.id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: meetings.length,
            data: meetings
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};