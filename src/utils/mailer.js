
import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

async function sendMail(to, subject, html) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.log(`[EMAIL SIMULYATSIYA] ${to} -> ${subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: SMTP_USER,
      to,
      subject,
      html
    });
  } catch (err) {
    console.error("Email xatosi:", err.message);
  }
}

export { sendMail };
