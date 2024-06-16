import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { IUser } from "@/models/user.model";
import { IDoctorProfile } from "@/models/doctor-profile.model";
import { IPatientProfile } from "@/models/patient-profile.model";

export const APPOINTMENT_STATUS = {
    PENDING: {
        enumValue: "PENDING",
        displayName: "Pending",
    },
    CANCELLED: {
        enumValue: "CANCELLED",
        displayName: "Cancelled",
    },
    COMPLETED: {
        enumValue: "COMPLETED",
        displayName: "Completed",
    },
};

export interface IAppointment extends mongoose.Document {
    message: string;
    date_time: Date;
    status: (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS]["enumValue"];

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
        status: {
            type: String,
            enum: Object.values(APPOINTMENT_STATUS).map((s) => s.enumValue),
            default: APPOINTMENT_STATUS.PENDING.enumValue,
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

appointmentSchema.plugin(paginate);

export default mongoose.model<IAppointment, mongoose.PaginateModel<IAppointment>>("appointments", appointmentSchema);
