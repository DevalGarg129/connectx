import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Auth header is missing"
            });
        }

        if(!authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        console.log("Authorization Header:", authHeader);
        const token = authHeader.split(" ")[1];

        console.log("Extracted Token:", token);
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        console.log("Decoded:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};