import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import { Tag } from "../models/tagModel.js";
import { sendInvites } from "../utils/generateEmails.js";
import { validateObjects } from "../utils/validateObjects.js";
import { emailSchema, userNameSchema } from "../validation/joiSchema.js";

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
      superManagerId: req.user._id,
      tagName: req.body.tagName.trim(),
    };
    if (req.body.managerEmails && req.body.managerEmails.length > 0) {
      sendInvites(req.body.managerEmails, newTag.tagName, "Manager");
      newTag.managers = req.body.managerEmails.map((email) => ({ email }));
    }
    if (req.body.memberEmails && req.body.memberEmails.length > 0) {
      sendInvites(req.body.memberEmails, newTag.tagName, "Member");
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
