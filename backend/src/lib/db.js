import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://yojna:QwmDjcRMpN5etfjo@whycluster.rznjk0b.mongodb.net/?retryWrites=true&w=majority&appName=whycluster"
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};


//HHrp@#12 
//yojna9097