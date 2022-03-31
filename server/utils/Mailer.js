import nodemailer from 'nodemailer';
import 'dotenv/config';

const HOST = process.env.MAIL_HOST;
const USER = process.env.MAIL_USER;
const PASS = process.env.MAIL_PASS;

const transporter = nodemailer.createTransport({
    host: HOST,
    port: 587,
    auth: {
        user: USER,
        pass: PASS,
    }
});

transporter.verify((err) => {
    if (err) console.log(err)
    else     console.log('MAILER~: Mail Server is ready')
});

export const sendMail = (to, subject, html) => {

    const message = {
        from: USER,
        to: to,
        subject: subject,
        html: html,
    }

    transporter.sendMail(message, (err, info) => {
        if (err) console.log(err)
        else console.log(`MAILER~: Email with subject "${subject}" has been sent to ${info.accepted}`);
    });
}