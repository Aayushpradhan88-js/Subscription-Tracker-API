// import nodemailer from 'nodemailer';
// import { MAIL_PASSWORD } from './env.js'
import User from '../models/userModel.js';
import Subscription from '../models/subscriptionModel.js';
import dayjs from 'dayjs';
import { Resend } from 'resend';
import { RESEND_KEY } from './env.js';

async function modelData(email) {
    const foundUser = await User.findOne().where({ email });
    if (!foundUser) return null;

    const subscription = await Subscription.findOne().where({ user: foundUser._id })
    if (!subscription) return null;
    return {
        username: foundUser.name,
        subscriptionName: subscription?.name,
        renewalDate: dayjs(subscription?.renewalDate).format('MMM D, YYYY'),
        planName: subscription?.name,
        price: `${subscription?.currency} ${subscription?.price} (${subscription?.frequency})`,
        paymentMethod: subscription?.paymentMethod
    }
};


// service: 'gmail',
// auth: {
//     user: accountEmail,
//     pass: MAIL_PASSWORD
// }
export const accountEmail = "aayushpradhan789@gmail.com";

// export const transporter = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     secure: false,
//     auth: {
//         user: "9712b316211f85",
//         pass: "838993d76456f1",
//     },
// });

const resend = new Resend(RESEND_KEY);

export const transporter = {
  sendMail: async (mailOptions) => {
    try {
      const { error } = await resend.emails.send({
        from: "SuperAgent <onboarding@resend.dev>",  // Free plan mein yehi allowed hai
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
        // reply_to: "support@yourapp.com",  // optional
      });

      if (error) {
        console.error("Resend Error:", error);
        throw error;
      }

      console.log(`Email successfully sent to ${mailOptions.to}`);
    } catch (err) {
      console.error("Failed to send email via Resend:", err);
      throw err;
    }
  },
};

export const sendMail = async (receiverEmail) => {
    const datas = await modelData(receiverEmail)
    if (!datas) return null;

    const mailOptions = {
        from: accountEmail,
        to: receiverEmail,
        subject: 'Subscription Plan',
        html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color: #4a90e2; text-align: center;">
                <p style="font-size: 54px; line-height: 54px; font-weight: 800;">Super Agent</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">                
                <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong style="color: #4a90e2;">${datas.username}</strong>,</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">Your <strong>${datas.subscriptionName}</strong> subscription will be expire on<strong style="color: #4a90e2;">${datas.renewalDate}</strong></p>
                
                <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #f0f7ff; border-radius: 10px; margin-bottom: 25px;">
                    <tr>
                        <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Plan:</strong> 
                            ${datas.planName}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Price:</strong>
                             ${datas.price}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px;">
                            <strong>Payment Method:</strong>
                             ${datas.paymentMethod}
                        </td>
                    </tr>
                </table>
                
                <p style="font-size: 16px; margin-bottom: 25px;">If you'd like to make changes or cancel your subscription, please visit your <a href="${datas.renewalDate}" style="color: #4a90e2; text-decoration: none;">account settings</a> before the renewal date.</p>
                " style="color: #4a90e2; text-decoration: none;">Contact our support team</a> anytime.</p>
                
                <p style="font-size: 16px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>The SuperAgent Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
                <p style="margin: 0 0 10px;">
                    SuperAgent Inc.
                </p>
                <p style="margin: 0;">
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Unsubscribe</a> | 
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</div>
    `
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        if (!info) {
            const unsuccessfulInfo = "failed to send mail"
            return unsuccessfulInfo;
        };

        return true;
    } catch (error) {
        console.error('Error sending email:', error.stack);
        return false;
    };
};