import mongoose from "mongoose";
import { IUser } from "@/models/user.model";

export const ETHNICITY = {
    WHITE: {
        enumValue: "WHITE",
        fullName: "White",
    },
    BLACK_OR_AFRICAN_AMERICAN: {
        enumValue: "BLACK_OR_AFRICAN_AMERICAN",
        fullName: "Black or African American",
    },
    HISPANIC_OR_LATINO: {
        enumValue: "HISPANIC_OR_LATINO",
        fullName: "Hispanic or Latino",
    },
    ASIAN: {
        enumValue: "ASIAN",
        fullName: "Asian",
    },
    NATIVE_AMERICAN_OR_ALASKA_NATIVE: {
        enumValue: "NATIVE_AMERICAN_OR_ALASKA_NATIVE",
        fullName: "Native American or Alaska Native",
    },
    NATIVE_HAWAIIAN_OR_OTHER_PACIFIC_ISLANDER: {
        enumValue: "NATIVE_HAWAIIAN_OR_OTHER_PACIFIC_ISLANDER",
        fullName: "Native Hawaiian or Other Pacific Islander",
    },
    OTHER: {
        enumValue: "OTHER",
        fullName: "Other",
    },
};

export interface IPatientProfile extends mongoose.Document {
    full_name: string;
    date_of_birth: Date;
    gender: "M" | "F" | "R";
    phone_number: {
        code: string;
        number: string;
    };
    major_illnesses: {
        name: string;
        period: Date;
    }[];
    surgeries: {
        name: string;
        period: Date;
    }[];
    allergies: string[];
    family_medical_history: string[];
    current_medications: string[];
    home_address: {
        city: string;
        state: string;
        street: string;
        country: string;
    };
    insurance_information: {
        provider: string;
        policy_number: string;
        group_number: string;
    };
    emergency_contact: {
        name: string;
        email: string;
        phone: string;
        relationship: string;
    };
    preferences: {
        languages: string[];
        accessibility_needs: string[];
        communication_preferences: string[];
    };
    occupation: string | null;
    ethnicity: (typeof ETHNICITY)[keyof typeof ETHNICITY]["enumValue"] | null;
    user_ref: IUser | mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const patientProfileSchema = new mongoose.Schema<IPatientProfile>(
    {
        full_name: {
            type: String,
            required: true,
        },
        date_of_birth: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ["M", "F", "R"],
            required: true,
        },
        phone_number: {
            type: {
                code: {
                    type: String,
                    required: true,
                },
                number: {
                    type: String,
                    required: true,
                },
            },
            required: true,
            _id: false,
        },
        major_illnesses: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    period: {
                        type: Date,
                        required: true,
                    },
                },
            ],
            default: [],
            required: true,
            _id: false,
        },
        surgeries: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    period: {
                        type: Date,
                        required: true,
                    },
                },
            ],
            default: [],
            required: true,
            _id: false,
        },
        allergies: {
            type: [String],
            default: [],
            required: true,
        },
        family_medical_history: {
            type: [String],
            default: [],
            required: true,
        },
        current_medications: {
            type: [String],
            default: [],
            required: true,
        },
        home_address: {
            type: {
                city: {
                    type: String,
                    required: true,
                },
                state: {
                    type: String,
                    required: true,
                },
                street: {
                    type: String,
                    required: true,
                },
                country: {
                    type: String,
                    required: true,
                },
            },
            required: true,
            _id: false,
        },
        insurance_information: {
            type: {
                provider: {
                    type: String,
                    required: true,
                },
                policy_number: {
                    type: String,
                    required: true,
                },
                group_number: {
                    type: String,
                    required: true,
                },
            },
            required: true,
            _id: false,
        },
        emergency_contact: {
            type: {
                name: {
                    type: String,
                    required: true,
                },
                email: {
                    type: String,
                    required: true,
                },
                phone: {
                    type: String,
                    required: true,
                },
                relationship: {
                    type: String,
                    required: true,
                },
            },
            required: true,
            _id: false,
        },
        preferences: {
            type: {
                languages: {
                    type: [String],
                    default: [],
                    required: true,
                },
                communication_preferences: {
                    type: [String],
                    default: [],
                    required: true,
                },
                accessibility_needs: {
                    type: [String],
                    default: [],
                    required: true,
                },
            },
            required: true,
            _id: false,
        },
        occupation: {
            type: String,
            default: null,
        },
        ethnicity: {
            type: String,
            enum: Object.values(ETHNICITY).map((item) => item.enumValue),
            default: null,
        },
        user_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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

export default mongoose.model<IPatientProfile>("patient-profiles", patientProfileSchema);
