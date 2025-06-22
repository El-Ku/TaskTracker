import nodemailer from "nodemailer";

// Create a transporter object using Gmail SMTP
const EmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  try {
    EmailTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("sendEmail Error:", error.message);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    throw error;
  }
};
