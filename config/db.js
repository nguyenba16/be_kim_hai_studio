// config/db.js
import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log("=> New database connection established");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

export default connectDB;
