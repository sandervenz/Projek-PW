import nodemailer from 'nodemailer';
import {
    USER_MAIL,
    PASS_MAIL,
} from '../env';

const transporter = nodemailer.createTransport({
    service: 'Zoho',
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: USER_MAIL,
        pass: PASS_MAIL,
    },
    requireTLS: true,
});

const sendMail = async ({
    from,
    to,
    subject,
    content,
}: {
    from: string;
    to: string | string[];
    subject: string;
    content: string;
}) => {
    const result = await transporter.sendMail({
        from: 'foodscoop@zohomail.com', // Alamat email Zoho
        replyTo: from, // Alamat email user
        to,
        subject,
        html: content,
    });

    console.log('Send Email from', from, 'to', to);

    return result;
};

export default sendMail;
