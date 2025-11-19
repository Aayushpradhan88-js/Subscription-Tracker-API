import { Router } from "express";
import {
    signUp,
    signin,
    logout
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authroutes = Router();
authroutes.route("/sign-up").post(signUp);
authroutes.route("/sign-in").post(authMiddleware,signin);
authroutes.route("/logout").get(authMiddleware,logout);

export default authroutes;