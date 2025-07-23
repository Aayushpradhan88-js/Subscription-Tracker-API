import { Router } from "express";

const authroutes = Router();

authroutes.get("/sign-up", (req, res) => {
    res.send("sign-up");
});

authroutes.get("/login", (req, res) => {
    res.send("ljogin");
});

authroutes.get("/logout", (req, res) => {
    res.send("logout");
});

export default authroutes;