import express from "express";
import cors from "cors";
import sendEmail from "./utils/email.js";

const app = express();

// app.use(cors("*"));

// sendEmail(
//   "pranjalkuhikar123@gmail.com", // to
//   "Test Email from Notification Service", // subject
//   "This is a plain text body for testing the email functionality.", // text
//   `<p>This is an <strong>HTML</strong> body for testing the email functionality.</p>`, // html
// );

export default app;
