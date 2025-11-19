import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { JWT_SECRET } from '../config/env.js';

const authMiddleware = async (req, res, next) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        };
        if (!token) return res.status(401).json({
            success: false,
            message: "unauthorized request: no token is provided"
        });

        const decode = jwt.verify(token, JWT_SECRET);
        if (!decode) return res.status(400).json({
            message: "failed to decode token, try again!!"
        });
        const user = await User.findById(decode.userId);
        if (!user) return res.status(400).json({
            success: false,
            message: "User not found"
        });

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.stack,
            message: "Invalid token"
        });
    };
};

export default authMiddleware;