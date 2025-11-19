import Subscription from "../models/subscriptionModel.js"
import mongoose from "mongoose";
import User from "../models/userModel.js";
// import { workflowClient } from "../config/upstash.js"
// import { SERVER_URL } from "../config/env.js";

//----------Getting all subscriptions of specific user-----//
const getAllSubscriptionOfUserId = async (req, res) => {
    const subscriptionUserId = req.params.id || req.user._id;
    //if ID is valid
    if (!mongoose.Types.ObjectId.isValid(subscriptionUserId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }

    //trying to access other user subscriptions
    if (req.user.id.toString() !== subscriptionUserId.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    };
    try {
        // const subscriptions = await Subscription.findOne({userId: subscriptionUserId});//not working
        const subscriptions = await Subscription
            .find({ user: new mongoose.Types.ObjectId(subscriptionUserId) })
            .sort({ createdAt: -1 }); //@.sort - for new values to show first   //gpt code working why
        if (!subscriptions || subscriptions.length === 0) {
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
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.stack
        });
    }
};

//----------Creating subscription---------- //
const createSubscription = async (req, res) => {
    const subscriptionUserId = req.params.id || req.user.id;
    //if ID is valid
    if (!mongoose.Types.ObjectId.isValid(subscriptionUserId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }

    const { name, price, currency, frequency, category, startDate, paymentMethod } = req.body;
    if (
        [name, price, currency, frequency, category, startDate, paymentMethod].some((fields) => fields.trim === '')
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    };


    //trying to access other user subscriptions
    if (req.user.id !== subscriptionUserId) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    };
    try {
        const isSubsriptionExisted = await Subscription.findOne({ name: name, user: req.user.id });
        if (isSubsriptionExisted) {
            if (isSubsriptionExisted.active === 'active') {
                return res.status(402).json({
                    success: false,
                    message: `this subscription ${name} is already existed in dashboard`
                });
            };
        };

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

        const user = await User.findById(req.user.id);
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

//----------SUBSCRIPTION with id---------- //
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

//----------Update subscription with id---------- //
const updateSubscriptionWithId = async (req, res) => {
    try {
        const subscriptionId = req.params.id || req.params.subscriptionId;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        };

        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            user: userId
        });
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        };

        Object.assign(subscription, req.body);

        await subscription.save();
        return res.status(200).json({
            success: true,
            data: subscription,
            message: "updated subscription successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.stack
        });
    };
};

//----------Delete subscription with id---------- //
const deleteSubscriptionWithId = async (req, res) => {
    const subscriptionId = req.params.id || req.params.subscriptionId;
    const loggedInUser = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    };

    try {
        //@verifying user through loggedInUser
        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            user: loggedInUser
        });
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        };

        const deleteSubscription = await Subscription.findByIdAndDelete(subscriptionId);
        if (!deleteSubscription) res.json("failed to delete subscription");

        return res.status(200).json({
            success: true,
            message: "successfully deleted subscription"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.stack
        });
    }
};

const cancelSubscriptionWithId = async (req, res) => {
    const subscriptionId = req.params.subscriptionId;
    const loggedInUser = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    };

    const subscription = await Subscription.findOne({
        subscriptionId,
        loggedInUser
    });
    if(!subscription){
        return res.status(400).json({
            success: false,
            message: "subscription not found"
        });
    };

    subscription.status = "cancelled";
    subscription.cancelledAt = new Date();

    await subscription.save();

    return res.status(200).json({
        success: true,
        data: subscription,
        message: "subscription cancelled!!"
    })

}

export {
    getAllSubscriptionOfUserId,
    getSubscriptionWithId,
    createSubscription,
    updateSubscriptionWithId,
    deleteSubscriptionWithId
};