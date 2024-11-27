import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "Projek-FoodScoop",
      // Increase timeouts for connection and socket
      connectTimeoutMS: 30000,  
      socketTimeoutMS: 45000,  
      serverSelectionTimeoutMS: 5000, 
    });
    return "Database connected";
  } catch (error) {
    return error;
  }
};

export default connect;
