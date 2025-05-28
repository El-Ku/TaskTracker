import EmailTransporter from "../config/email.js";

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
        console.error("❌ Error:", error.message);
      } else {
        console.log("✅ Email sent:", info.response);
      }
    });
  } catch (error) {
    throw error;
  }
};

export const sendWelcomeEmail = async (userEmail, username) => {
  sendEmail(
    userEmail,
    "Welcome to Task Creator",
    `Hello ${username},
    
        Thank you for joining Task Creator! We're excited to have you on board.
        
        If you are not the one who registered, please ignore this email. Or contact us at ${process.env.EMAIL_USER} to delete your account.
        
        Best regards,
        The Task Creator Team`
  );
};
