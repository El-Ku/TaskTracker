import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import { Tag } from "../models/tagModel.js";
import { ConfirmToken } from "../models/confirmTokenModel.js";
import { Notifications } from "../models/notificationsModel.js";
import { sendInvites } from "../utils/generateEmails.js";
import { validateObjects } from "../utils/validateObjects.js";
import { emailSchema, userNameSchema } from "../validation/joiSchema.js";
import mongoose, { mongo } from "mongoose";

// Load all tags associated with a user
export const loadAll = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const tags = user.tags;
    if (tags.length > 0) {
      res.json({
        result: "success",
        message: "Tags retrieved successfully",
        payload: tags,
      });
    } else {
      res.json({ result: "success", message: "User is not part of any tags" });
    }
  } catch (error) {
    next(error);
  }
});

// Create a tag
export const createTag = asyncHandler(async (req, res, next) => {
  try {
    tagSanityCheck(req.body);
    const newTag = {
      _id: new mongoose.Types.ObjectId(),
      superManagerId: req.user._id,
      tagName: req.body.tagName.trim(),
    };
    if (req.body.managerEmails && req.body.managerEmails.length > 0) {
      sendInvites(
        req.body.managerEmails,
        newTag.tagName,
        "Manager",
        newTag._id
      );
      newTag.managers = req.body.managerEmails.map((email) => ({ email }));
    }
    if (req.body.memberEmails && req.body.memberEmails.length > 0) {
      sendInvites(req.body.memberEmails, newTag.tagName, "Member", newTag._id);
      newTag.members = req.body.memberEmails.map((email) => ({ email }));
    }
    const savedTag = await Tag.create(newTag); // save to database after removing duplicates
    console.log("New tag created:", savedTag);
    if (savedTag) {
      res.json({
        result: "success",
        message: "Tag was created successfully",
        payload: savedTag,
      });
    } else {
      res.status(404).json({
        result: "error",
        message: "Tag wasn't created successfully",
      });
    }
  } catch (error) {
    next(error);
  }
});

export const acceptInvite = asyncHandler(async (req, res, next) => {
  try {
    const token = req.params.token;
    if (!token || token.trim() === "") {
      return res.status(400).json({
        result: "error",
        message: "Invalid or missing token",
      });
    }
    const confirmToken = await ConfirmToken.findOne({ token });
    if (!confirmToken) {
      return res.status(404).json({
        result: "error",
        message: "Token not found",
      });
    } else if (confirmToken.expiryDate < Date.now()) {
      return res.status(400).json({
        result: "error",
        message: "Token has expired",
      });
    }

    const userId = req.user._id;
    const tagId = confirmToken.action.tagId;
    const role = confirmToken.action.role;
    const user = await User.findById(userId);
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({
        result: "error",
        message: "This tag is either deleted or doesn't exist",
      });
    }
    if (role === "Manager") {
      // Check if user is already a manager
      const isManager = tag.managers.some(
        (manager) => manager.email === user.email && manager.confirmed === true
      );
      if (isManager) {
        return res.status(400).json({
          result: "error",
          message: "You are already a manager of this tag",
        });
      }
      // Add user as a manager
      for (const index in tag.managers) {
        if (tag.managers[index].email === user.email) {
          await Tag.updateOne(
            { "managers._id": tag.managers[index]._id }, // match the sub-document
            {
              $set: {
                "managers.$.userId": userId,
                "managers.$.confirmed": true,
              },
            }
          );
          break;
        }
      }
    } else if (role === "Member") {
      // Check if user is already a member
      const isMember = tag.members.some(
        (member) => member.email === user.email && member.confirmed === true
      );
      if (isMember) {
        return res.status(400).json({
          result: "error",
          message: "You are already a member of this tag",
        });
      }
      // Add user as a member
      for (const index in tag.members) {
        if (tag.members[index].email === user.email) {
          await Tag.updateOne(
            { "members._id": tag.members[index]._id }, // match the sub-document
            {
              $set: {
                "members.$.userId": userId,
                "members.$.confirmed": true,
              },
            }
          );
          break;
        }
      }
    }
    // Add the tag to user's tags array
    await User.updateOne(
      { _id: userId },
      {
        $addToSet: {
          tags: {
            tagId: tag._id,
            tagName: tag.tagName,
            userRole: role,
          },
        },
      }
    );
    // Remove the confirm token after successful acceptance
    await ConfirmToken.deleteOne({ token });

    res.json({
      result: "success",
      message: "User added to the tag successfully",
    });
  } catch (error) {
    next(error);
  }
});

const tagSanityCheck = (reqBody) => {
  try {
    if (reqBody.managerEmails && reqBody.managerEmails.length > 0) {
      validateObjects(reqBody.managerEmails, emailSchema);
    }
    if (reqBody.memberEmails && reqBody.memberEmails.length > 0) {
      validateObjects(reqBody.memberEmails, emailSchema);
    }

    if (!reqBody.tagName || reqBody.tagName.trim() === "") {
      throw new Error("Tag name is required");
    }
    validateObjects(reqBody.tagName.trim(), userNameSchema);
  } catch (error) {
    throw new Error(error.message);
  }
};
