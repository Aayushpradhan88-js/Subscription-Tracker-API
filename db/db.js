import mongoose from "mongoose";
import {NODE_ENV} from "../config/env.js";

const DB_URL="mongodb+srv://aayushpradhanjs:aayushpradhanjs12345@subscriptionapi.vmuh47m.mongodb.net/"

const dbConnection = async () => {
    try {
        const connectionString = await mongoose.connect(`${DB_URL}`);
        return console.log(`MONGODB IS SUCCESSFULLY CONNECTED TO ${NODE_ENV} MODE`, connectionString);
    } catch (error) {
        console.log(DB_URL);
        console.log("MONGODB CONNECTION IS FAILED", error)
        process.exit(1);
    }
};

export default dbConnection;