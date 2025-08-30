import { Router } from "express";
import {
    signUp,
    signin,
    logout
} from "../controllers/authcontroller.js";

const authroutes = Router();

authroutes.post("/sign-up", signUp);

authroutes.post("/sign-in", signin);

authroutes.get("/logout",logout);

export default authroutes;