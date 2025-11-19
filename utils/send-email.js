import dayjs from 'dayjs';
import { accountEmail, transporter } from '../config/nodemailer.js';
import { emailTemplates } from './email-templete.js';
import User from "../models/userModel.js"

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
    };

    const message = tempelate.generateBody(mailInfo);
    const subject = tempelate.generateSubject(mailInfo);
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(301).json({
            message: "User not found"
        });
    };

    try {
        await transporter.sendMail({
            from: accountEmail,
            to: user.email,
            subject: subject,
            html: message,
        });
    } catch (error) {
        return res.send(403).json({
            message: "internal server error",
            error: error.stack
        })
    }
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) console.log('Failed to send mail', error);

    //     console.log('Email send: ', info.response)
    // })
};