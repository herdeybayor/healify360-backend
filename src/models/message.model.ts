import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { IUser } from "@/models/user.model";
import { IAppointment } from "@/models/appointment.model";

export interface IMessage extends mongoose.Document {
    message: string;
    sender_ref: IUser | mongoose.Types.ObjectId;
    appointment_ref: IAppointment | mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
    {
        message: {
            type: String,
            required: true,
        },
        sender_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        appointment_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "appointments",
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

messageSchema.plugin(paginate);

export default mongoose.model<IMessage, mongoose.PaginateModel<IMessage>>("messages", messageSchema);
