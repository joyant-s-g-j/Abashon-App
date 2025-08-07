import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader) {
            return res.status(401).json({ success: true, message: "Unauthorized - No Authorization Header"})
        }

        if(!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid Authorization Format" })
        }

        const token = authHeader.split(" ")[1];
        if(!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded || !decoded.userId) {
            return res.status(401).json({message: "Unauthorized - Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        req.user = user
        next()
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized - Token Expired" });
        }
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const adminRoute = async (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        next()
    } else {
        return res.status(403).json({ message: "Access denied - Admin Only" })
    }
}