import { Router } from "express";

const subscriptionroutes = Router();

subscriptionroutes.get("/", (req, res) => res.send("GETTING all subscriptions"));

subscriptionroutes.post("/", (req, res) => res.send("CREATING user subscriptions"));

subscriptionroutes.patch("/:id", (req, res) => res.send("UPDATING user subscriptions"));

subscriptionroutes.delete("/", (req, res) => res.send("Deleteing user subscriptions"));

subscriptionroutes.get("/user/:id", (req, res) => res.send("GETTING all user subscriptions"));

subscriptionroutes.put("/:id/cancel", (req, res) => res.send("CANCELLING user subscriptions"));

subscriptionroutes.put("/up-comming renewals", (req, res) => res.send("RENEWALS user subscriptions"));

export default subscriptionroutes;