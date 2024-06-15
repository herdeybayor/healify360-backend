import mongoose from "mongoose";
import { IUser } from "@/models/user.model";
import { IAppointment } from "@/models/appointment.model";
import { IPatientProfile } from "@/models/patient-profile.model";
import { IDoctorProfile } from "@/models/doctor-profile.model";

export const MEDICATION_FORM = {
    TABLET: {
        enumValue: "TABLET",
        fullName: "Tablet",
    },
    CAPSULE: {
        enumValue: "CAPSULE",
        fullName: "Capsule",
    },
    LIQUID: {
        enumValue: "LIQUID",
        fullName: "Liquid",
    },
    INJECTION: {
        enumValue: "INJECTION",
        fullName: "Injection",
    },
    CREAM: {
        enumValue: "CREAM",
        fullName: "Cream",
    },
    OINTMENT: {
        enumValue: "OINTMENT",
        fullName: "Ointment",
    },
    GEL: {
        enumValue: "GEL",
        fullName: "Gel",
    },
    PATCH: {
        enumValue: "PATCH",
        fullName: "Patch",
    },
    INHALER: {
        enumValue: "INHALER",
        fullName: "Inhaler",
    },
    SUPPOSITORY: {
        enumValue: "SUPPOSITORY",
        fullName: "Suppository",
    },
    DROPS: {
        enumValue: "DROPS",
        fullName: "Drops",
    },
    SPRAY: {
        enumValue: "SPRAY",
        fullName: "Spray",
    },
};

export interface IPrescription extends mongoose.Document {
    medications: {
        name: string;
        dosage: string;
        quantity: string;
        usage_instruction: string;
        form: (typeof MEDICATION_FORM)[keyof typeof MEDICATION_FORM]["enumValue"];
    }[];

    appointment_ref: IAppointment | mongoose.Types.ObjectId;

    doctor_ref: IUser | mongoose.Types.ObjectId;
    doctor_profile_ref: IDoctorProfile | mongoose.Types.ObjectId;

    patient_ref: IUser | mongoose.Types.ObjectId;
    patient_profile_ref: IPatientProfile | mongoose.Types.ObjectId;

    created_at: Date;
    updated_at: Date;
}

const prescriptionSchema = new mongoose.Schema<IPrescription>(
    {
        medications: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    dosage: {
                        type: String,
                        required: true,
                    },
                    quantity: {
                        type: String,
                        required: true,
                    },
                    usage_instruction: {
                        type: String,
                        required: true,
                    },
                    form: {
                        type: String,
                        enum: Object.values(MEDICATION_FORM).map((form) => form.enumValue),
                        required: true,
                    },
                },
            ],
            required: true,
        },

        appointment_ref: {
            type: mongoose.Types.ObjectId,
            ref: "appointments",
            required: true,
        },

        doctor_ref: {
            type: mongoose.Types.ObjectId,
            ref: "users",
            required: true,
        },
        doctor_profile_ref: {
            type: mongoose.Types.ObjectId,
            ref: "doctor-profiles",
            required: true,
        },

        patient_ref: {
            type: mongoose.Types.ObjectId,
            ref: "users",
            required: true,
        },
        patient_profile_ref: {
            type: mongoose.Types.ObjectId,
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

export default mongoose.model<IPrescription>("prescriptions", prescriptionSchema);
