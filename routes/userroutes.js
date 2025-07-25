import { Router } from "express";

import { getUser, getUsers } from "../controllers/usercontroller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const userroutes = Router();

userroutes.get("/", getUsers )

userroutes.get("/:id", authMiddleware ,getUser );

userroutes.delete("/:id", getUser );

userroutes.patch("/:id", (req, res) => {res.send("edit user")});

userroutes.post("/", (req, res) => {res.send("all users")});

export default userroutes