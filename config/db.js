import mongoose from "mongoose";
import { NODE_ENV } from "./env.js";

const MONGODB_URI = `mongodb://127.0.0.1:27017/premium-tracker`;
const dbConnection = async () => {
    try {
        await mongoose.connect(`${MONGODB_URI}`);
        return console.log(`database is successfully connected in ${NODE_ENV} mode`);
    } catch (error) {
        console.error("failed to connect database", error.stack);
    };
};

export default dbConnection;