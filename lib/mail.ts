import nodemailer,{getTestMessageUrl} from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

function mailBody(text: string): string {
    return `
    <div>
     <h3>Hello There!</h3>
      <p>${text}</p>
     </div>
    `
}
// interface MailResponse {
//     message: string;
// }
export interface MailResponse {
    accepted?: (string)[] | null;
    rejected?: (null)[] | null;
    envelopeTime: number;
    messageTime: number;
    messageSize: number;
    response: string;
    envelope: Envelope;
    messageId: string;
  }
  export interface Envelope {
    from: string;
    to?: (string)[] | null;
  }

export async function sendPasswordResetEmail(resetToken:string,to: string): Promise<void> {
    const info = (await transporter.sendMail({
        to,
        from:'test@example.com',
        subject: 'Reset Password',
        html: mailBody(`
        <a href="http://localhost:7777/reset?token=${resetToken}"> Click here to Reset Your Password</a>
        `)
    }))as MailResponse;
    console.log(info)
    if(process.env.MAIL_USER.includes('ethereal.email')) {
        console.log(` preview  at ${getTestMessageUrl(info)}`);
      }
}