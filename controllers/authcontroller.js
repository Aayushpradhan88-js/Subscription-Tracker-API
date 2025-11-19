import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

import User from '../models/userModel.js';

//SIGN-UP
export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
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
        // console.log("token", token, JWT_EXPIRES_IN, JWT_SECRET);

        const userData = await User.findById(user[0]._id).select("-password");

        res
            .status(201)
            .json({
                success: true,
                data: {
                    token,
                    User: userData
                },
                message: 'User created successfully'
            });

    } catch (error) {
        console.log("sever failed to signup the user", error);
        throw error;
    }
};

//SIGN-IN
export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)

        const user = await User.findOne({ email });
        if (!user) {
            const message = new Error('Invalid email address');
            message.statusCode = 401;
            throw message;
        }
        console.log(user);

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            const message = new Error('Invalid password');
            message.statusCode = 401;
            throw message;
        };

        const token = jwt.sign(
            {
                userId: user._id
            },
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRES_IN
            }
        );

        const userData = await User.findById(user._id)
            .select("-password")

        console.log(userData)
        res
            .status(200)
            .json({
                success: true,
                message: 'User logged in successfully',
                data: {
                    token,
                    User: userData
                }
            });

    } catch (error) {
        console.log("Failed to sign in", error);
        next()
    };
};

//LOG-OUT
export const logout = async (req, res) => {
    res.send("logout");
}