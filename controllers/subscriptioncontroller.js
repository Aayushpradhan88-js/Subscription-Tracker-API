import Subscription from "../models/subscriptionmodel.js"
import { workflowClient } from "../config/upstash.js"

export const createSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });
        console.log("body",req.body)

        const { workflowRunId } = await workflowClient.trigger({
            // eslint-disable-next-line no-undef
            url: `${process.env.SERVER_URL}/api/v1/workflow/subscription/remainder`,
            body: {
                subscriptionId: subscription._id
            },
            headers: {
                'Content-Type': 'application/json'
            },
            retries: 2
        });

        console.log(subscription);

        return res
            .status(200)
            .json({
                data: {
                    subscription,
                    workflowRunId
                }
            })
    }
    catch (error) {
        console.log(error);
    }
};


export const getUserSubscription = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new error("You're not the valid user of this subscription");
            error.status = 403;
            throw error;
        };

        const subscription = await Subscription.find({ user: req.params.id });

        return res
            .status(200)
            .json({
                data: subscription
            })
    }

    catch (error) {
        console.log(error);
    };
};