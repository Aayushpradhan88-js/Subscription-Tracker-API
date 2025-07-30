import dayjs from 'dayjs';
import { accountMail, transporter } from '../config/nodemailer.js';
import { emailTemplates } from './email-templete.js';

export const sendRemainderEmail = async ({ to, type, subscription }) => {
    if (!type || !to) throw new Error("type and to are required!");

    const mailType = emailTemplates.find((mail) => mail.label === type);

    if (!mailType) throw new Error("Invalid mailType");

    const mailInfo = {
        username: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format("YYYY, MMM D"),
        planName: subscription.name,
        price: `${subscription.current} ${subscription.price}(${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod
    }

    const message = mailType.generateBody(mailInfo);
    const subject = mailType.generateSubject(mailInfo);

    const mailOption = {
        from: accountMail,
        to: to,
        subject: subject,
        html: message
    };

    transporter.sendMail(mailOption, (error, info) => {
        if (error) console.log('Failed to send mail', error);

        console.log('Email send: ',  info.response)
    })
}