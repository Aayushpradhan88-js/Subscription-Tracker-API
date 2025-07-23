import mongoose from "mongoose";

const schema = mongoose.schema;

const userModel = new schema({
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
        maxLength: [15, "Password must be at most 15 characters long"],
    }
},
    {
        timestamps: true,
    }
);

const user = mongoose.model('Users', userModel)

export default user;