// import sgMail from '@sendgrid/mail';
import { envVariables } from './env';

import nodemailer, { Transporter } from 'nodemailer';

type SendEmailParams = {
  code: string;
  email: string;
};

let transporter: Transporter;

async function initializeTransporter() {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.email',
    port: 587,
    secure: false,
    auth: {
      user: envVariables.APP_EMAIL,
      pass: envVariables.APP_PASSWORD,
    },
  });
}

export async function sendEmail({ code, email }: SendEmailParams) {
  if (!transporter) {
    await initializeTransporter();
  }

  let message = `Your password reset code: <strong>${code}</strong>. Verify within 10 minutes`;

  console.log(envVariables.APP_EMAIL, envVariables.APP_PASSWORD);
  const mailOptions = {
    from: envVariables.APP_EMAIL,
    to: email,
    subject: 'Reset your password',
    html: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  // const msg = {
  //   to: email,
  //   from: 'blanknoize8@gmail.com',
  //   subject: 'Reset your password',
  //   html: message,
  // };
  // console.log(envVariables.SENDGRID_API_KEY);
  // sgMail.setApiKey(envVariables.SENDGRID_API_KEY);

  // await sgMail.send(msg);
}
