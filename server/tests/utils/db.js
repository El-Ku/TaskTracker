import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const connection = await MongoClient.connect("mongodb://localhost:27017/");
const db = connection.db("TaskTracker");

export const clearDB = async () => {
  const collections = await db.listCollections().toArray();
  for (const { name } of collections) {
    await db.collection(name).deleteMany({});
  }
};

export const getUserInfo = async (userId) => {
  return db
    .collection("users")
    .findOne({ _id: ObjectId.createFromHexString(String(userId)) });
};

export const getNotificationInfos = async (userId) => {
  return db
    .collection("notifications")
    .find({
      userId: String(userId),
    })
    .toArray();
};

export const countConfirmTokens = async () => {
  return db.collection("confirmtokens").countDocuments();
};

export const getUserInfoByEmailId = async (email) => {
  return db.collection("users").findOne({ email: email });
};

export const deleteTagById = async (tagId) => {
  return db
    .collection("tags")
    .deleteOne({ _id: ObjectId.createFromHexString(tagId) });
};

export const getAllConfirmTokens = async () => {
  return db.collection("confirmtokens").find({}).toArray();
};
