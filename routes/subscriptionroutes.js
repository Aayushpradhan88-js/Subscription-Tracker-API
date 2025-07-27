import { Router } from "express";

import {authMiddleware} from "../middlewares/authmiddleware.js";
import { 
    createSubscription, 
    getUserSubscription,

} from "../controllers/subscriptioncontroller.js";

const subscriptionroutes = Router();

subscriptionroutes.get("/", (req, res) => res.send("GETTING all subscriptions"));

subscriptionroutes.post("/", authMiddleware, createSubscription);

subscriptionroutes.patch("/:id", (req, res) => res.send("EDITING user subscriptions"));

subscriptionroutes.delete("/", (req, res) => res.send("Deleteing user subscriptions"));

subscriptionroutes.get("/user/:id",authMiddleware, getUserSubscription);

subscriptionroutes.put("/:id/cancel", (req, res) => res.send("CANCELLING user subscriptions"));

subscriptionroutes.put("/up-comming renewals", (req, res) => res.send("RENEWALS user subscriptions"));

export default subscriptionroutes;