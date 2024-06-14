import mongoose from "mongoose";
import { CONFIGS } from "@/configs";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(CONFIGS.MONGODB_URI);

        console.log(":::> Connected to database MongoDB <:::");
    } catch (error) {
        console.error("<::: Couldn't connect to database", error);
    }
};

mongoose.Query.prototype.setOptions = function () {
    if (this.mongooseOptions().lean == null) {
        this.mongooseOptions({ lean: true });
    }

    return this;
};

export { connectMongoDB };
