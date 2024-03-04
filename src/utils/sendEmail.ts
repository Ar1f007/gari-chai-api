import sgMail from '@sendgrid/mail';
import { envVariables } from './env';

type SendEmailParams = {
  code: string;
  email: string;
};

export async function sendEmail({ code, email }: SendEmailParams) {
  let message = `Your password reset code: <strong>${code}</strong>. Verify within 10 minutes`;

  const msg = {
    to: email,
    from: 'blanknoize8@gmail.com',
    subject: 'Reset your password',
    html: message,
  };

  sgMail.setApiKey(envVariables.SENDGRID_API_KEY);

  await sgMail.send(msg);
}
