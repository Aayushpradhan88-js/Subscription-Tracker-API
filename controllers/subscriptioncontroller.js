import Subscription from "../models/subscriptionmodel.js"
import { workflowReminder } from "./upstashworkflowcontroller.js";

export const createSubscription = async (req, res) => {

    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        }
        );

        await workflowReminder({
            url: `${process.env.SERVER_URL}`
        })

        console.log(subscription)

        return res
        .status(200)
        .json({
            data: subscription
        })
    } 
    
    catch (error) {
        console.log(error);
    }
};


export const getUserSubscription = async(req, res) => {
    try {
        if(req.user.id !== req.params.id){
            const error = new error("You're not the valid user of this subscription");
            error.status = 403;
            throw error;
        };
    
        const subscription = await Subscription.find({user: req.params.id});
    
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