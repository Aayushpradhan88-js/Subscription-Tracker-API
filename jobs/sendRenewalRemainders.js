import Subscription from "../models/subscriptionModel.js";
import { emailTemplates } from "../utils/email-templete.js";
import { transporter, accountEmail } from "../config/nodemailer.js";
import dayjs from "dayjs";

const sendRenewalRemainders = async () => {
    const today = dayjs().startOf('day');
    const remaindersToSend = [];

    try {
        const activeSubscriptions = await Subscription.find({
            status: "active",
        }).populate("user", "name email");

        for (const subscription of activeSubscriptions) {
            const renewal = dayjs(subscription.renewalDate).startOf('day');
            const daysLeft = renewal.diff(today, 'day');

            //if renewal days remains less than 7 days - email send
            if ([1, 2, 5, 7].includes(daysLeft)) {
                const tempelateLabel = `${daysLeft} days before remainder`;
                remaindersToSend.push({
                    subscription,
                    daysLeft,
                    tempelateLabel
                });
            }
        };

        //Loop for email sending
        for (const { susubscription, daysLeft, tempelateLabel } of remaindersToSend) {
            const tempelate = emailTemplates.find(t => t.label === tempelateLabel);
            if (!tempelate) continue;

            const mailData = {
                userName: susubscription.user.name,
                subscriptionName: susubscription.name,
                renewalDate: susubscription.renewal.format('MMM D, YYY'),
                planName: susubscription.name,
                price: `${susubscription.currency} ${susubscription.price} (${susubscription.frequency})`,
                paymentMethod: susubscription.paymentMethod,
                daysLeft
            };
            const html = tempelate.generateBody(mailData);
            const subject = tempelate.generateSubject(mailData);

            await transporter.sendMail({
                from: `"SuperAgent"<${accountEmail}>`,
                to: susubscription.user.email,
                subject: subject,
                html
            });
        };
    } catch (error) {
        console.error("Reminder job failed:", error.stack);
    }
}

export default sendRenewalRemainders;