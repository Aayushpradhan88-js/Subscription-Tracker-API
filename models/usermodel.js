import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S.+@.+\.\S+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: [6, "Password must be at least 6 characters long"],
    },
},
    {
        timestamps: true,
    }
);

const user = mongoose.model('Users', userModel)

export default user;