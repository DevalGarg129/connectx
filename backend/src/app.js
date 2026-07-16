import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";

import { connectToSocket } from "./controllers/socketManager.js";

import userRoutes from "./routes/users.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import roomRoutes from "./routes/room.routes.js";

import { User } from "./models/user.model.js";
import { Meeting } from "./models/meeting.model.js";

import errorHandler from "./middlewares/error.middleware.js";

import initializeSocket from "./socket/socketManager.js";

const app = express();
const server = http.createServer(app);
connectToSocket(server);
initializeSocket(server);

const MONGO_URI = "mongodb+srv://tradelocker:tradelocker123@cluster0.xpkmjlk.mongodb.net/";
const PORT = process.env.PORT || 8000;

app.set("port", PORT);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/meetings", meetingRoutes);
app.use("/api/v1/rooms/", roomRoutes);

console.log(PORT);
console.log(process.env.JWT_SECRET);

const start = async () => {
    try {
        const connectionDb = await mongoose.connect(MONGO_URI);

        console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);

        // Remove old indexes (run once)
        try {
            await mongoose.connection.collection("users").dropIndex("email_1");
            console.log("Dropped old email_1 index");
        } catch (err) {
            console.log("email_1 index not found");
        }

        try {
            await mongoose.connection.collection("meetings").dropIndex("meeting_id_1");
            console.log("Dropped old meeting_id_1 index");
        } catch (err) {
            console.log("meeting_id_1 index not found");
        }

        // Create indexes from schema
        await User.syncIndexes();
        await Meeting.syncIndexes();

        console.log("Indexes synchronized successfully");

        server.listen(PORT, () => {
            console.log(`Listening On Port ${PORT}`);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

app.use(errorHandler);
start();