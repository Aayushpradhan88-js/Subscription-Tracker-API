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
userroutes.route("/:userid").get(authMiddleware,getUser);
userroutes.route("/:userid").delete(authMiddleware,deleteUser);
userroutes.route("/:userid").patch(authMiddleware,editUser);

export default userroutes;