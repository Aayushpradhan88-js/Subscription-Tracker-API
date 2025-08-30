import { Router } from "express";

import { getUser, getUsers } from "../controllers/usercontroller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const userroutes = Router();

userroutes.get("/", getUsers )

userroutes.get("/:id", authMiddleware ,getUser );

userroutes.delete("/:id", authMiddleware, (req, res) => {res.status(501).json({success: false, message: "Delete functionality not implemented yet"})});

userroutes.patch("/:id", authMiddleware, (req, res) => {res.status(501).json({success: false, message: "Update functionality not implemented yet"})});

export default userroutes