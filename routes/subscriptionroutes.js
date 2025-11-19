import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import {
    getAllSubscriptionOfUserId,
    getSubscriptionWithId,
    createSubscription,
    updateSubscriptionWithId,
    deleteSubscriptionWithId,
    cancelSubscriptionWithId
} from "../controllers/subscriptionController.js";

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTFkNzA5ZTAwOGFjNzgwOWJiZTYwODAiLCJpYXQiOjE3NjM1MzcwNTQsImV4cCI6MTc2NjEyOTA1NH0.eoeuzNkCmjR14GbHeF5htVteMiFGYEeT7EAMa2yN6vI

const router = express.Router();
router.use(authMiddleware);

router
    .route("/user/:userId")
    .get(getAllSubscriptionOfUserId)
    .post(createSubscription)
    .get(getSubscriptionWithId)

router
    .route("/:subscriptionId")
    .patch(updateSubscriptionWithId)
    .delete(deleteSubscriptionWithId);

router.route("/:subscriptionId/cancel").patch(cancelSubscriptionWithId);

// router.route("/up-comming renewals").put("RENEWALS user subscriptions");
// 
export default router;