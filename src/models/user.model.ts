import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    email: string;
    last_name: string;
    password?: string;
    first_name: string;
    is_onboarding_complete: boolean;
    role: "patient" | "doctor" | "admin";
    created_at: Date;
    updated_at: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
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
        is_onboarding_complete: {
            type: Boolean,
            required: true,
            default: false,
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
