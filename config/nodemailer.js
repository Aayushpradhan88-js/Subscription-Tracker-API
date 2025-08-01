import nodemailer from 'nodemailer';
import {MAIL_PASSWORD} from './env.js'

export const accountEmail = "aayushpradhan789@gmail.com";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: MAIL_PASSWORD
    }
});
console.log(MAIL_PASSWORD)