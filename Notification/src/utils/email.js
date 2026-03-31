import nodemailer from "nodemailer";
import config from "../configs/config.js";

const requiredEmailConfig = [
  "EMAIL_USER",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "REFRESH_TOKEN",
];

const missingEmailConfig = requiredEmailConfig.filter((key) => !config[key]);

const logEmailConfigHelp = () => {
  if (missingEmailConfig.length === 0) {
    return;
  }

  console.error(
    `Missing email configuration: ${missingEmailConfig.join(", ")}`
  );
};

const logEmailAuthHelp = (error) => {
  const message = String(error?.message || "");

  if (error?.code !== "EAUTH" || !message.includes("invalid_grant")) {
    return;
  }

  console.error(
    [
      "Gmail rejected the OAuth token exchange.",
      "Check that CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, and EMAIL_USER all belong to the same Google account/app.",
      "If your Google OAuth consent screen is still in Testing mode, refresh tokens can expire after 7 days.",
      "If the refresh token was revoked or generated for a different OAuth client, create a new one and update Notification/.env.",
    ].join(" ")
  );
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.EMAIL_USER,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    refreshToken: config.REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    logEmailConfigHelp();
    logEmailAuthHelp(error);
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Spotify Piper" <${config.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
