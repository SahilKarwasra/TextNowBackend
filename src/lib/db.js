import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB is Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Connected failed: ${error}`);
    }
};

