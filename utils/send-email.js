import dayjs from 'dayjs';
import { accountEmail, transporter } from '../config/nodemailer.js';
import { emailTemplates } from './email-templete.js';
import User from "../models/usermodel.js"

export const sendRemainderEmail = async (req, res, { to, type, subscription }) => {
    if (!type || !to) throw new Error("Missing parameters type and to are required!");

    const tempelate = emailTemplates.find((mail) => mail.label === type);

    if (!tempelate) throw new Error("Invalid tempelate");

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    }

    const message = tempelate.generateBody(mailInfo);
    const subject = tempelate.generateSubject(mailInfo);
    const user = await User.findById(req.user._id);
    if (!user) {
        res
            .status(301)
            .json(
                {
                    message: "User not found"
                }
            )
    }

    console.log("User email is:", user.email);
    try {
        await transporter.sendMail({
            from: accountEmail,
            to: user.email,
            // to: to,
            subject: subject,
            html: message,
        });
        console.log("User email is:", user.email);
    } 
    
    catch (error) {
        console.log("server error", error)
    }
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) console.log('Failed to send mail', error);

    //     console.log('Email send: ', info.response)
    // })
}