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

export const getUserInfo = async (user_id) => {
  return db
    .collection("users")
    .findOne({ _id: ObjectId.createFromHexString(String(user_id)) });
};
