import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import User from '../models/usermodel.js';

//SIGN-UP
export const signUp = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;
        // console.log(req.body);
        const existingUser = await User.findOne({ email }).session(session);
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
                password: hashPassword
            }],
            { session }
        );

        // console.log(req.body ,user);

        const token = jwt.sign(
            { userId: user[0]._id },
            // eslint-disable-next-line no-undef
            process.env.JWT_SECRET,
            // eslint-disable-next-line no-undef
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        // console.log("token", token, JWT_EXPIRES_IN, JWT_SECRET);

        const userData = await User.findById(user[0]._id).select("-password").session(session);

        await session.commitTransaction();
        session.endSession();

        res
            .status(201)
            .json({
                success: true,
                message: 'User created successfully',
                data: {
                    token,
                    User: userData
                }
            });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

//SIGN-IN
export const signin = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password } = req.body;

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

        const token = jwt.sign(
            {
                userId: user._id
            },
            // eslint-disable-next-line no-undef
            process.env.JWT_SECRET,
            {
                // eslint-disable-next-line no-undef
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        const userData = await User.findById(user._id).select("-password").session(session);

        await session.commitTransaction();
        session.endSession();

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
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

//LOG-OUT
export const logout = async (req, res) => {
    res.send("logout");
}