import express from "express";
import { Router } from "express";
import { authMiddleware } from "../middlewares/user.middleware.js";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  endRoom,
  getRoom,
  getMyRooms,
  updateRoomSettings,
  deleteRoom,
} from "../controllers/room.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/create", createRoom);
router.post("/join/:roomId", joinRoom);
router.post("/leave/:roomId", leaveRoom);
router.get("/my", getMyRooms);
router.get("/:roomId", getRoom);
router.patch("/settings/:roomId", updateRoomSettings);
router.patch("/end/:roomId", endRoom);
router.delete("/:roomId", deleteRoom);

export default router;


