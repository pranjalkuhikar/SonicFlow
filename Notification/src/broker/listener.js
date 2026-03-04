import { subscribeToQueue } from "./rabbit.js";
import sendEmail from "../utils/email.js";

function startListening() {
  subscribeToQueue("User Created", async (data) => {
    const { id, email, firstName, lastName } = data;

    const userTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Welcome to SonicFlow</title>
            <style>
            body { font-family: Arial, sans-serif; background:#f7f7f7; margin:0; padding:40px 0; }
            .email-container { max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
            .header { background:#0066ff; color:#ffffff; padding:30px 40px; text-align:center; }
            .header h1 { margin:0; font-size:26px; }
            .content { padding:30px 40px; color:#333333; line-height:1.6; }
            .content h2 { margin-top:0; font-size:20px; color:#0066ff; }
            .cta { display:inline-block; margin-top:20px; background:#0066ff; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:4px; font-weight:bold; }
            .footer { background:#f1f1f1; padding:20px 40px; font-size:12px; color:#777777; text-align:center; }
            </style>
        </head>
        <body>
            <div class="email-container">
            <div class="header">
                <h1>Welcome to SonicFlow!</h1>
            </div>
            <div class="content">
                <h2>Hello ${firstName} ${lastName},</h2>
                <p>We're thrilled to have you join us. Your account has been created successfully and you're all set to explore everything SonicFlow has to offer.</p>
                <p>Click the button below to get started and personalize your experience:</p>
                <p class="cta">Get Started</p>
                <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:support@sonicflow.com">support@sonicflow.com</a>.</p>
                <p>Thanks for joining, and welcome aboard!</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} SonicFlow. All rights reserved.
            </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(email, "Welcome to SonicFlow", undefined, userTemplate);
  });
}

export default startListening;
