import jwt from 'jsonwebtoken';

import User from '../models/usermodel.js';

export const authMiddleware = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        console.log(token);

        if (!token) return next(401, "UNAUTHORIZED REQUEST: NO TOKEN PROVIDED");
         // eslint-disable-next-line no-undef
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode)

        const user = await User.findById(decode.userId);
        if (!user) return res
            .status(400)
            .json({ success: false, message: "User not found" });

        req.user = user;

        next();

    } catch (error) {
        res
            .status(500)
            .json({ success: false,
                 message: error.message });
    }
}