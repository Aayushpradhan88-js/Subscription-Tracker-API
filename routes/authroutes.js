import { Router } from "express";
import {
    signUp,
    signin
} from "../controllers/authcontroller.js";

const authroutes = Router();

authroutes.post("/sign-up", signUp);

authroutes.post("/sign-in", signin);

authroutes.get("/logout", (req, res) => {
    res.send("logout");
});

export default authroutes;