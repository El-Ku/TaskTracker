import { MongoClient } from "mongodb";

export const clearDB = async () => {
  const connection = await MongoClient.connect("mongodb://localhost:27017/");
  const db = connection.db("TaskTracker");
  const collections = await db.listCollections().toArray();
  for (const { name } of collections) {
    await db.collection(name).deleteMany({});
  }
  await connection.close();
};
