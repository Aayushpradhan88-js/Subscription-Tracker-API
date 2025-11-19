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

        const subscriptions = await Subscription.find(subscriptionUserId);
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
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });
        // console.log("successfully stored in database subscription data", req.body)


        // const { workflowRunId } = await workflowClient.trigger({
        //     url: `${SERVER_URL}/api/v1/workflow/subscription/remainder`,
        //     body: {
        //         subscriptionId: subscription._id
        //     },
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     retries: 2
        // });


        return res
            .status(200)
            .json({
                data: {
                    subscription,
                }
            })
    }
    catch (error) {
        console.log("upstash failed", error.response?.data || error.message || error);
        console.log("upstash failed", error)
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

export {getAllSubscriptionOfUserId, getSubscriptionWithId, createSubscription}