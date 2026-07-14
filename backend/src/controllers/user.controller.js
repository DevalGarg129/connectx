import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Please provide username and password"
        });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "User Not Found"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "Invalid Username or Password"
            });
        }
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Login Successful",
            token
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });

    }
};

const register = async (req, res) => {
    const { name, email, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        console.log(req.body);
        await newUser.save();
        return res.status(httpStatus.CREATED).json({
            success: true,
            message: "User Registered Successfully"
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

const getUserHistory = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "User Not Found"
            });
        }

        const meetings = await Meeting.find({
            user_id: user.username
        });

        return res.status(httpStatus.OK).json(meetings);

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "User Not Found"
            });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        });

        await newMeeting.save();

        return res.status(httpStatus.CREATED).json({
            success: true,
            message: "Added code to history"
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });

    }
};

export {
    login,
    register,
    getUserHistory,
    addToHistory
};