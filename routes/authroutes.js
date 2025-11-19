import { Router } from "express";
import {
    signUp,
    signin,
    logout
} from "../controllers/authController.js";

const authroutes = Router();

authroutes.route("/sign-up").post(signUp);

authroutes.route("/sign-in").post(signin);

authroutes.route("/logout").get(logout);

export default authroutes;