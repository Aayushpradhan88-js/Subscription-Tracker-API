import { Router } from "express";

import { 
    getUser, 
    getUsers,
    deleteUser,
    editUser
} from "../controllers/usercontroller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const userroutes = Router();

userroutes.get("/", getUsers )
userroutes.get("/:id", authMiddleware ,getUser );
userroutes.delete("/:id", authMiddleware, deleteUser);
userroutes.patch("/:id", authMiddleware, editUser);

export default userroutes