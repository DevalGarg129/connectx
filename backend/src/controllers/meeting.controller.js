import { Meeting } from "../models/meeting.model";
import { User } from "../models/user.model";
import { crypto } from "crypto";

//create meeting controller
export const createMeeting = async(req, res) => {
    try{
        const { title } = req.body;

        // Generate meeting id
        const meetingId = crypto.randomUUID();

        const meeting = await Meeting.create({
            meetingId,
            title: title || 'Untitled Meeting',
            host: req.user.id,
            participants: [req.user.id],
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "Meeting Created Successfully",
            meeting,
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Join meeting controller
export const joinMeeting = async(req, res) => {
    try{
        const { meetingId } = req.params;

        const meeting = await Meeting.findOne({
            meetingId,
            isActive: true
        });

        if(!meeting){
            return res.sta
        }
    }catch(error){

    }
}




