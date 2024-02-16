import nodemailer from 'nodemailer';

import { SendEmailInterface } from '@/types';

export const sendEmail = async (data: SendEmailInterface): Promise<void> => {
  // 1) destruction Data
  const { from,to, subject, text } = data;
  // 2) Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // 3) Define Email Options (Like From, To, Subject, Email Content)
  const mailOption = {
    from,
    to,
    subject,
    text,
  };

  // 4) Send Email
  await transporter.sendMail(mailOption);
};
