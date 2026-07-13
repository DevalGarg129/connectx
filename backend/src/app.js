import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";

import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const MONGO_URI = "mongodb+srv://tradelocker:tradelocker123@cluster0.xpkmjlk.mongodb.net/"
const PORT = process.env.PORT;

app.set("port", (process.env.PORT || 8000))
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", meetingRoutes);

console.log(PORT);
console.log(process.env.JWT_SECRET);

const start = async () => {
    app.set("mongo_user");
    const connectionDb = await mongoose.connect(MONGO_URI);
    
    console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log("Listening On Port 8000")
    });
}

start();