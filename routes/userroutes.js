import { Router } from "express";
import { 
    getUser, 
    getUsers,
    deleteUser,
    editUser
} from "../controllers/userController.js"
import authMiddleware  from "../middlewares/authMiddleware.js";

const userroutes = Router();
userroutes.route("/").get(getUsers);
userroutes.route("/:id").get(authMiddleware,getUser);
userroutes.route("/:id").delete(authMiddleware,deleteUser);
userroutes.route("/:id").patch(authMiddleware,editUser);

export default userroutes;