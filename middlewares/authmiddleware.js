import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { JWT_SECRET } from '../config/env.js'

export const authMiddleware = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        console.log(token);

        if (!token) return res.status(401).json({ success: false, message: "UNAUTHORIZED REQUEST: NO TOKEN PROVIDED" });
        const decode = jwt.verify(token, JWT_SECRET);
        console.log(decode)

        const user = await User.findById(decode.userId);
        if (!user) return res
            .status(400)
            .json({ success: false, message: "User not found" });

        req.user = user;

        console.log(user);

        next();

    } catch (error) {
        console.log("failed to check auth user", error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}