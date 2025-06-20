import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.log("Error while trying to connect to MongoDB:", err);
    process.exit();
  }
};

export default connectDB;
