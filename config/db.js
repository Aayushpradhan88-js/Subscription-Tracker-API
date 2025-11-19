import mongoose from "mongoose";
import { NODE_ENV } from "./env.js";

// const DB_NAME = "CRUDAPPLICATION"
const MONGODB_URI =`mongodb://127.0.0.1:27017/premium-tracker`
export const dbConnection = async () => {
    try {
        const connectionString = await mongoose.connect(
            `${MONGODB_URI}`
        )
        return console.log(`MONGODB IS SUCCESSFULLY CONNECTED TO ${NODE_ENV} MODE`);
    } catch (error) {
        console.log("MONGODB CONNECTION IS FAILED", error.message)
        process.exit(1)
    }
}