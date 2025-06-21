import { sendEmail } from "../config/email.js";
import { User } from "../models/userModel.js";
import { createNotificationsAndTokens } from "./createNotificationsAndTokens.js";

export const sendWelcomeEmail = async (userEmail, username) => {
  await sendEmail(
    userEmail,
    "Welcome to Task Tracker",
    `Hello ${username},
    
        Thank you for joining Task Tracker! We're excited to have you on board.
        
        If you are not the one who registered, please ignore this email. Or contact us at ${process.env.EMAIL_USER} to delete your account.
        
        Best regards,
        The Task Tracker Team`
  );
};

export const sendInviteEmailsToMembers = async (inviteeEmail, tagName) => {
  await sendEmail(
    inviteeEmail,
    `Invitation to join ${tagName} tag on Task Tracker`,
    `Hello there,
    
        You have been invited by someone from TaskTracker app to become a part of the ${tagName} tag.
        
        You will be joining this tag as a member. 

        Please ignore this email if you are not sure what is going on. Or you can just visit us and get to know what is this all about.
        
        Best regards,
        The Task Tracker Team`
  );
};

const sendInviteEmailsToManagers = async ({
  inviteeEmail,
  tagName,
  regLink,
}) => {
  await sendEmail(
    inviteeEmail,
    `Invitation to join ${tagName} tag on Task Tracker`,
    `Hello there,
    
        You have been invited by someone from TaskTracker app to become a part of the ${tagName} tag.
        
        You will be joining this tag as a Manager. 

        Please click here to accept the invitation: ${regLink}
        

        Please ignore this email if you are not sure what is going on. Or you can just visit us and get to know what is this all about.
        
        Best regards,
        The Task Tracker Team`
  );
};

export const sendInvites = async (emails, tagName, role) => {
  try {
    const emailInfo = await createNotificationsAndTokens(emails, tagName, role);
    for (const info of emailInfo) {
      if (role === "Manager") {
        await sendInviteEmailsToManagers(info);
      } else {
        await sendInviteEmailsToMembers(info);
      }
    }
  } catch (error) {
    throw new Error("Failed to send invite emails to managers");
  }
};
