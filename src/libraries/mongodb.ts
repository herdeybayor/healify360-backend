import mongoose from "mongoose";
import { CONFIGS } from "@/configs";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(CONFIGS.MONGODB_URI);
    } catch (error) {
        console.error("<::: Couldn't connect to database", error);
    }
};

export { connectMongoDB };
