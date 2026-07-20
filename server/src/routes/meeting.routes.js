import { Router } from "express";
import { 
    createMeeting,
    joinMeeting,
    leaveMeeting,
    endMeeting,
    getMeeting,
    getMyMeetings
} from "../controllers/meeting.controller.js";
import { authMiddleware } from "../middlewares/user.middleware.js";
const router = Router();

router.post('/create', authMiddleware, createMeeting);
router.post("/join/:meetingCode", authMiddleware, joinMeeting);
router.post("/leave/:meetingCode", authMiddleware, leaveMeeting);
router.put("/end/:meetingCode", authMiddleware, endMeeting);
router.get("/:meetingCode", authMiddleware, getMeeting);
router.get("/my/all", authMiddleware, getMyMeetings);

export default router;
