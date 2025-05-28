import nodemailer from "nodemailer";

// Create a transporter object using Gmail SMTP
const EmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default EmailTransporter;

