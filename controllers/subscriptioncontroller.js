import Subscription from "../models/subscriptionModel.js"
import mongoose from "mongoose";
// import { workflowClient } from "../config/upstash.js"
// import { SERVER_URL } from "../config/env.js";

const getAllSubscriptionOfUserId = async (req, res) => {
    const subscriptionUserId = req.params.id || req.user.id;

    //if ID is valid
    if (!mongoose.Types.ObjectId.isValid(subscriptionUserId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }

    //trying to access other user subscriptions
    if (req.user.id !== subscriptionUserId) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    };
    try {

        const subscriptions = await Subscription.find({ subscriptionId: subscriptionUserId });
        if (!subscriptions) {
            return res.status(404).json({
                success: false,
                message: "No subscriptions found"
            });
        };

        return res.status(200).json({
            success: true,
            count: `You're total subscriptions ${subscriptions.length}`,
            data: subscriptions,
            message: "Successfully fetched all subscriptions"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.stack
        });
    }
};

//---------- CREATING SUBSCRIPTION---------- //
const createSubscription = async (req, res) => {
    const subscriptionUserId = req.params.id || req.user.id;
    const { name, price, currency, frequency, category, startDate, paymentMethod } = req.body;
    if (
        [name, price, currency, frequency, category, startDate, paymentMethod].some((fields) => fields.trim === '')
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    };

    //if ID is valid
    if (!mongoose.Types.ObjectId.isValid(subscriptionUserId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }

    //trying to access other user subscriptions
    if (req.user.id !== subscriptionUserId) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    };
    try {
        const subscription = await Subscription.create({
            name,
            price,
            currency,
            frequency,
            category,
            startDate,
            paymentMethod,
            user: req.user.id
        });
        if (!subscription) {
            return res.status(500).json({
                sucess: false,
                message: "failed to create subscription"
            });
        };

        const user = await Subscription.findOne(subscriptionUserId, { name })
        return res.status(200).json({
            success: true,
            data: subscription,
            message: `${user.name} your're subscription is added in dashboard`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.stack
        });
    }
};

//---------- CREATING SUBSCRIPTION---------- //
const getSubscriptionWithId = async (req, res, next) => {

    try {
        if (req.user.id !== req.params.id) {
            return next(new Error("You're not the valid user of this subscription"))
        };

        const subscription = await Subscription.find({ user: req.params.id });

        return res
            .status(200)
            .json({
                data: subscription
            })
    }
    catch (error) {
        console.log("failed to get error", error);
    };
};

export { getAllSubscriptionOfUserId, getSubscriptionWithId, createSubscription }