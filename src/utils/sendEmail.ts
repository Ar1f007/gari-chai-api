// import sgMail from '@sendgrid/mail';
import { StatusCodes } from 'http-status-codes';
import AppError from './appError';
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

  const mailOptions = {
    from: envVariables.APP_EMAIL,
    to: email,
    subject: 'Reset your password',
    html: message,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      throw new AppError('Something went wrong while sending email', StatusCodes.INTERNAL_SERVER_ERROR);
    } else {
      //
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
