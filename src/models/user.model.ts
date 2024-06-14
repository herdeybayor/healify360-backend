import mongoose from "mongoose";

interface IUser extends mongoose.Document {
    name: string;
    email: string;
    username: string;
    password?: string;
    role: "patient" | "doctor" | "admin";
    created_at: Date;
    updated_at: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ["patient", "doctor", "admin"],
            default: "patient",
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

export default mongoose.model<IUser>("users", userSchema);
