import crypto from "crypto";
import { User } from "../models/userModel.js";
import { Notifications } from "../models/notificationsModel.js";
import { ConfirmToken } from "../models/confirmTokenModel.js";

export const createNotificationsAndTokens = async (emails, tagName, role) => {
  // Check if these emails are of already registered users
  const regUsers = await User.find({ email: { $in: emails } }, { email: 1 });
  //console.log("Registered users found:", regUsers);

  // Create a notification array for all the invites.
  const notifications = [];
  const confirmTokens = [];
  const emailInfo = [];
  for (const email of emails) {
    const notification = {
      notificationText: `You have been invited to join the ${tagName} tag as a ${role}`,
    };

    const token = crypto.randomBytes(32).toString("hex");
    const gotoUrlOnClick = `${process.env.SITE_URL}/api/tags/accept-invite/${token}`;
    notification.gotoUrlOnClick = gotoUrlOnClick;

    const matchedUser = regUsers.find((user) => user.email === email);
    if (matchedUser) {
      notification.userId = matchedUser._id;
    } else {
      notification.userId = email; //this needs to be replaced later with userId when the user register
      emailInfo.push({
        email,
        tagName,
        gotoUrlOnClick,
      });
    }

    notifications.push(notification);
    confirmTokens.push({ token: token });
  }
  const savedNotifications = await Notifications.insertMany(notifications);
  if (!savedNotifications || savedNotifications.length === 0) {
    throw new Error("Failed to save notifications for tag invites");
  }
  const savedConfirmTokens = await ConfirmToken.insertMany(confirmTokens);
  if (!savedConfirmTokens || savedConfirmTokens.length === 0) {
    throw new Error("Failed to save confirmation tokens for tag invites");
  }
  return emailInfo;
};
