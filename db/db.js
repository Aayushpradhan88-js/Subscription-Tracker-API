import mongoose from "mongoose";
import {NODE_ENV} from "../config/env.js";

const DB_URL="mongodb+srv://aayushjs:aayushjs12345@cluster0.uuqee4l.mongodb.net/"
// const DB_NAME="subscriptiontracker";

const dbConnection = async () => {
    try {
        const connectionString = await mongoose.connect(`${DB_URL}`);
        return console.log(`MONGODB IS SUCCESSFULLY CONNECTED TO ${NODE_ENV} MODE`);
    } catch (error) {
        console.log("MONGODB CONNECTION IS FAILED", error)
        process.exit(1);
    }
};

export default dbConnection;