import mongoose from "mongoose";
import { IUser } from "@/models/user.model";
import { IPatientProfile } from "@/models/patient-profile.model";
import { IDoctorProfile } from "@/models/doctor-profile.model";

interface IAppointment extends mongoose.Document {
    message: string;
    date_time: Date;

    doctor_ref: IUser | mongoose.Types.ObjectId;
    doctor_profile_ref: IDoctorProfile | mongoose.Types.ObjectId;

    patient_ref: IUser | mongoose.Types.ObjectId;
    patient_profile_ref: IPatientProfile | mongoose.Types.ObjectId;

    created_at: Date;
    updated_at: Date;
}

const appointmentSchema = new mongoose.Schema<IAppointment>(
    {
        message: {
            type: String,
            required: true,
        },
        date_time: {
            type: Date,
            required: true,
        },

        doctor_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        doctor_profile_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "doctor-profiles",
            required: true,
        },

        patient_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        patient_profile_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "patient-profiles",
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

export default mongoose.model<IAppointment>("appointments", appointmentSchema);
