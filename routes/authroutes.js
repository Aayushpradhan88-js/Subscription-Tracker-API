import { Router } from "express";
import {
    signUp,
    signin,
    logout
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authroutes = Router();
authroutes.route("/sign-up").post(signUp);
authroutes.route("/sign-in").post(authMiddleware,signin); //@token is required
authroutes.route("/logout/:id").get(authMiddleware,logout);

export default authroutes;