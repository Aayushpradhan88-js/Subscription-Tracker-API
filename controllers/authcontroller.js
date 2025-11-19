import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

//SIGN-UP
export const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        };

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create(
            [{
                name,
                email,
                password: hashPassword,
            }],
        );

        const token = jwt.sign(
            { userId: user[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const userData = await User.findById(user[0]._id).select("-password");

        res.status(201).json({
            success: true,
            data: {
                token,
                User: userData
            },
            message: 'User created successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: error.stack
        });
    }
};

//SIGN-IN
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            const message = new Error('Invalid email address');
            message.statusCode = 401;
            throw message;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            const message = new Error('Invalid password');
            message.statusCode = 401;
            throw message;
        };

        const token = jwt.sign({ userId: user._id },
            JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }
        );

        const userData = await User.findById(user._id).select("-password");
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
                User: userData
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: error.stack
        });
    };
};

//LOG-OUT
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true, 
            sameSite: 'strict'
        })
        res.status(200).json({
            success: true,
            message: "User logout successfully"
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message: "internal server error",
            error: error.stack
        });
    };
};