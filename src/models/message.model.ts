import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { IUser } from "@/models/user.model";
import { IAppointment } from "@/models/appointment.model";
import { IDoctorProfile } from "@/models/doctor-profile.model";
import { IPatientProfile } from "@/models/patient-profile.model";

export interface IMessage extends mongoose.Document {
    message: string;
    sent_by: "doctor" | "patient";
    sender_ref: IUser | mongoose.Types.ObjectId;
    appointment_ref: IAppointment | mongoose.Types.ObjectId;
    doctor_profile_ref: IDoctorProfile | mongoose.Types.ObjectId;
    patient_profile_ref: IPatientProfile | mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
    {
        message: {
            type: String,
            required: true,
        },
        sent_by: {
            type: String,
            enum: ["doctor", "patient"],
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
        doctor_profile_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "doctor-profiles",
        },
        patient_profile_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "patient-profiles",
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
