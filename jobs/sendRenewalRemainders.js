import Subscription from "../models/subscriptionModel.js";
import { emailTemplates } from "../utils/email-templete.js";
import { transporter, accountEmail } from "../config/nodemailer.js";
import dayjs from "dayjs";

const sendRenewalRemainders = async () => {
    console.log("Running renewal reminder job...");

    const today = dayjs().startOf("day");
    const remindersToSend = [];
    try {
        const activeSubscriptions = await Subscription.find({
            status: "active",
        }).populate("user", "name email");

        for (const subscription of activeSubscriptions) {

            const renewal = dayjs(subscription.renewalDate || subscription.nextRenewalDate).startOf("day");
            const daysLeft = renewal.diff(today, "day");

            console.log(`${subscription.user.email} - ${subscription.name} → ${daysLeft} days left`);

            if ([1, 2, 3, 5, 7].includes(daysLeft) && daysLeft > 0) {
                const templateLabel = `${daysLeft} days before remainder`;
                remindersToSend.push({
                    subscription,
                    daysLeft,
                    templateLabel,
                });
            };
        };

        // Send emails
        for (const { subscription, daysLeft } of remindersToSend) {
            const template = emailTemplates.find(t =>
                t.label.toLowerCase().includes(`${daysLeft} day`) ||
                t.label.toLowerCase().includes(`${daysLeft} days`)
            );
            if (!template) { console.log(`No template for ${daysLeft} days → using fallback`) }

            const mailData = {
                userName: subscription.user.name,
                subscriptionName: subscription.name,
                renewalDate: dayjs(subscription.renewalDate || subscription.nextRenewalDate).format("MMM D, YYYY"),
                planName: subscription.name,
                price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
                paymentMethod: subscription.paymentMethod || "Not specified",
                daysLeft,
            };

            const html = template.generateBody(mailData);
            const subject = template.generateSubject(mailData);

            try {
                await transporter.sendMail({
                    from: `"SuperAgent" <${accountEmail}>`,
                    to: subscription.user.email,
                    subject,
                    html,
                });
                console.log(`Reminder sent to ${subscription.user.email} (${daysLeft} days left)`);
            } catch (mailError) {
                console.error(`Failed to send email to ${subscription.user.email}:`, mailError);
            };
        };
        console.log(`Renewal reminder job completed. Sent ${remindersToSend.length} emails.`);
    } catch (error) {
        console.error("Renewal reminder job failed:", error);
    };
};

export default sendRenewalRemainders;