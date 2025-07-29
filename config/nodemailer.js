import nodemailer from 'nodemailer';

import {MAIL_PASSWORD} from '../config/env.js';

export const accountMail = "aayushpradhan789@gmail.com";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountMail,
        MAIL_PASSWORD: MAIL_PASSWORD
    }
});

// export default transporter;