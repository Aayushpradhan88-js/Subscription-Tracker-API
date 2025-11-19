import { Router } from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import { 
    getAllSubscriptionOfUserId,
    getSubscriptionWithId,
    createSubscription
} from "../controllers/subscriptionController.js";

const subscriptionroutes = Router();
subscriptionroutes.route("/").get(authMiddleware, getAllSubscriptionOfUserId);
subscriptionroutes.route("/").post(authMiddleware, createSubscription)
subscriptionroutes.route("/user/:id").get(authMiddleware, getSubscriptionWithId)
subscriptionroutes.patch("/:id", (req, res) => res.send("EDITING user subscriptions"));
subscriptionroutes.delete("/", (req, res) => res.send("Deleteing user subscriptions"));
subscriptionroutes.put("/:id/cancel", (req, res) => res.send("CANCELLING user subscriptions"));
subscriptionroutes.put("/up-comming renewals", (req, res) => res.send("RENEWALS user subscriptions"));

export default subscriptionroutes;