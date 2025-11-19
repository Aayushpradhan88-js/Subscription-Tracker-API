import { Router } from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import { 
    getAllSubscriptionOfUserId,
    getSubscriptionWithId,
    createSubscription,
    updateSubscriptionWithId
} from "../controllers/subscriptionController.js";

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTFkNzA5ZTAwOGFjNzgwOWJiZTYwODAiLCJpYXQiOjE3NjM1MzcwNTQsImV4cCI6MTc2NjEyOTA1NH0.eoeuzNkCmjR14GbHeF5htVteMiFGYEeT7EAMa2yN6vI

const subscriptionroutes = Router();
subscriptionroutes.route("/:userid").get(authMiddleware, getAllSubscriptionOfUserId);

subscriptionroutes.route("/:userid").post(authMiddleware, createSubscription)

subscriptionroutes.route("/:userid").get(authMiddleware, getSubscriptionWithId)

subscriptionroutes.route("/:userid").patch(authMiddleware, updateSubscriptionWithId);

subscriptionroutes.delete("/", (req, res) => res.send("Deleteing user subscriptions"));
subscriptionroutes.put("/:id/cancel", (req, res) => res.send("CANCELLING user subscriptions"));
subscriptionroutes.put("/up-comming renewals", (req, res) => res.send("RENEWALS user subscriptions"));

export default subscriptionroutes;