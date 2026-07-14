import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    //meeting id
    meetingCode: {
      type: String,
      required: true,
      unique: true,
    },

    //title
    title: {
      type: String,
      default: "untitled Meeting",
    },

    //host
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //Participants
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    //Check if is Active or Not
    isActive: {
      type: Boolean,
      default: true,
    },

    //Meeting Start time
    startedAt: {
      type: Date,
      default: Date.now,
    },

    //Meeting end time
    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
