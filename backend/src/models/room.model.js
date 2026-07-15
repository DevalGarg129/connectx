import mongoose, { Schema } from "Schema";

//Schema of Participants 
const participantSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        enum: [ "Host", "Co-Host", "Participant" ],
        default: "Participant"
    },
    joinedAt: {
        type: Date,
        default: Date.now()
    },
    leftAt: {
        type: Date,
        default: null
    },
    isMuted: {
        type: Boolean,
        default: false
    },
    isVideoOn: {
        type: Boolean,
        default: true
    },
    isScreenSharing: {
        type: Boolean,
        default: false
    },
    handRaised: {
        type: Boolean,
        default: false
    },
    isConnected: {
        type: Boolean,
        default: true
    },
}, { _id: false });

//Schema of Room Settings
const roomSettingsSchema = new Schema({
    waitingRoomEnabled: {
        type: Boolean,
        default: false
    },
    roomLocked: {
        type: Boolean,
        default: false
    },
    roomPassword: {
        type: String,
        default: ""
    },
    maxParticipants: {
        type: Number,
        default: 120,
        min: 2,
        max: 500
    },
    allowChat: {
        type: Boolean,
        default: true
    },
    allowScreenShare: {
        type: Boolean,
        default: true
    },
    hostOnlyScreenShare: {
        type: Boolean,
        default: false
    },
    allowRecording: {
        type: Boolean,
        default: false
    },
    muteParticipantsOnJoin: {
        type: Boolean,
        default: false
    },
    allowParticipantstoUnmute: {
        type: Boolean,
        default: true
    },
    allowParticipantstoRename: {
        type: Boolean,
        default: true
    },
    allowParticipantstoShareVideo: {
        type: Boolean,
        default: true
    },
    allowFileSharing: {
        type: Boolean,
        default: false
    },
    allowReactions: {
        type: Boolean,
        default: true
    },
}, { _id: false });

//Schema of Room
const roomSchema = new Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    title: {
        type: String,
        default: null,
        trim: true
    },
    description: {
        type: String,
        default: " ",
        trim: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participants: {
        type: [participantSchema],
        default: []
    },
    status: {
        type: String,
        enum: ["Waiting", "Active", "Ended"],
        default: "Waiting"
    },
    meetingType: {
        type: String,
        enum: ["Instant", "Scheduled"],
        default: "Instant"
    },
    startedAt: {
        type: Date,
        default: null
    },
    endedAt: {
        type: Boolean,
        default: null
    },
    meetingduration: {
        type: Number,
        default: 0
    },
    participants: {
        type: Number,
        default: 1
    },
    isDeleted: {
        Type: Boolean,
        default: false
    }
}, { timestamps: true });

//Exporting the models
export const Room = mongoose.model("Room", roomSchema);