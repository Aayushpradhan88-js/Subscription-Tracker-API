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
import sendRenewalRemainders from "../jobs/sendRenewalRemainders.js";

const router = express.Router();
router.use(authMiddleware);

router
    .route("/user/:userId")
    .get(getAllSubscriptionOfUserId)
    .post(createSubscription)
    .get(getSubscriptionWithId);

router
    .route("/:subscriptionId")
    .patch(updateSubscriptionWithId)
    .delete(deleteSubscriptionWithId);

router.route("/:subscriptionId/cancel").patch(cancelSubscriptionWithId);

router.route("/test-remainder").get(authMiddleware, async (_, res) => {
    await sendRenewalRemainders();
    res.json({
        success: true,
        message: "Reminder emails sent (check console)"
    });
});

export default router;