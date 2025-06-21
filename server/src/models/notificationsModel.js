import mongoose from "mongoose";

const notificationsSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  notificationText: {
    type: String,
    required: true,
  },
  gotoUrlOnClick: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  existsSince: {
    type: Date,
    default: Date.now(),
  },
});

notificationsSchema.index({ _id: -1, userId: 1 });

export const Notifications = mongoose.model(
  "Notifications",
  notificationsSchema
);
