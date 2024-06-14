import mongoose from "mongoose";
import { IUser } from "@/models/user.model";

export const EDUCATION_TYPES = {
    MD: {
        enumValue: "MD",
        fullName: "Doctor of Medicine",
    },
    DO: {
        enumValue: "DO",
        fullName: "Doctor of Osteopathic Medicine",
    },
    BS: {
        enumValue: "BS",
        fullName: "Bachelor of Science",
    },
    BA: {
        enumValue: "BA",
        fullName: "Bachelor of Arts",
    },
    MS: {
        enumValue: "MS",
        fullName: "Master of Science",
    },
    MA: {
        enumValue: "MA",
        fullName: "Master of Arts",
    },
    MPH: {
        enumValue: "MPH",
        fullName: "Master of Public Health",
    },
    MHA: {
        enumValue: "MHA",
        fullName: "Master of Health Administration",
    },
    Residency: {
        enumValue: "Residency",
        fullName: "Residency",
    },
    Fellowship: {
        enumValue: "Fellowship",
        fullName: "Fellowship",
    },
    Internship: {
        enumValue: "Internship",
        fullName: "Internship",
    },
    PhD: {
        enumValue: "PhD",
        fullName: "Doctor of Philosophy",
    },
    DSc: {
        enumValue: "DSc",
        fullName: "Doctor of Science",
    },
    MBA: {
        enumValue: "MBA",
        fullName: "Master of Business Administration",
    },
    JD: {
        enumValue: "JD",
        fullName: "Juris Doctor",
    },
    DDS: {
        enumValue: "DDS",
        fullName: "Doctor of Dental Surgery",
    },
    DMD: {
        enumValue: "DMD",
        fullName: "Doctor of Medicine in Dentistry",
    },
} as const;

export const SPECIALIZATION = {
    Cardiology: ["Interventional Cardiology", "Electrophysiology", "Heart Failure & Transplantation", "Preventive Cardiology", "Nuclear Cardiology"],
    Dermatology: ["Pediatric Dermatology", "Dermatopathology", "Mohs Surgery", "Cosmetic Dermatology"],
    Endocrinology: ["Diabetes", "Thyroid Disorders", "Bone and Mineral Metabolism", "Endocrine Oncology", "Pediatric Endocrinology"],
    Gastroenterology: ["Hepatology", "Inflammatory Bowel Disease", "Advanced Endoscopy", "Pediatric Gastroenterology", "Neurogastroenterology"],
    Neurology: ["Stroke", "Epilepsy", "Movement Disorders", "Neuromuscular Medicine", "Neurocritical Care", "Pediatric Neurology"],
    Orthopedics: ["Sports Medicine", "Joint Replacement", "Spine Surgery", "Pediatric Orthopedics", "Orthopedic Oncology", "Hand Surgery"],
    Pediatrics: ["Pediatric Cardiology", "Pediatric Endocrinology", "Pediatric Gastroenterology", "Pediatric Neurology", "Pediatric Oncology", "Pediatric Pulmonology"],
    Psychiatry: ["Child and Adolescent Psychiatry", "Geriatric Psychiatry", "Forensic Psychiatry", "Addiction Psychiatry", "Consultation-Liaison Psychiatry"],
    Surgery: ["General Surgery", "Cardiothoracic Surgery", "Neurosurgery", "Pediatric Surgery", "Plastic Surgery", "Vascular Surgery"],
    Urology: ["Pediatric Urology", "Urologic Oncology", "Female Pelvic Medicine and Reconstructive Surgery", "Male Infertility", "Endourology"],
} as const;

interface IDoctorProfile extends mongoose.Document {
    bio: string;
    full_name: string;
    date_of_birth: Date;
    gender: "M" | "F" | "R";
    years_of_experience: number;
    home_address: {
        city: string;
        state: string;
        street: string;
        country: string;
    };
    phone_number: {
        code: string;
        number: string;
    };
    specialization: keyof typeof SPECIALIZATION;
    sub_specialization: (typeof SPECIALIZATION)[keyof typeof SPECIALIZATION][number];
    education: {
        year: number;
        institution: string;
        field_of_study: string;
        degree: (typeof EDUCATION_TYPES)[keyof typeof EDUCATION_TYPES]["enumValue"];
    }[];
    medical_license: string;
    states_of_licensure: {
        state: string;
        license_number: string;
    }[];
    malpractice_insurance_details: {
        provider: string;
        policy_number: string;
        coverage_amount_in_dollars: number;
    };
    services_provided: {
        procedures: string[];
        conditions_treated: string[];
    };
    awards: {
        title: string;
        year: number;
    }[];
    publication: {
        title: string;
        year: number;
    }[];
    user_ref: IUser | mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const doctorProfileSchema = new mongoose.Schema<IDoctorProfile>(
    {
        bio: {
            type: String,
            required: true,
        },
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
        years_of_experience: {
            type: Number,
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
        specialization: {
            type: String,
            enum: Object.keys(SPECIALIZATION),
            required: true,
        },
        sub_specialization: {
            type: String,
            required: true,
            enum: Object.values(SPECIALIZATION).flat(),
        },
        education: {
            type: [
                {
                    year: {
                        type: Number,
                        required: true,
                    },
                    institution: {
                        type: String,
                        required: true,
                    },
                    field_of_study: {
                        type: String,
                        required: true,
                    },
                    degree: {
                        type: String,
                        enum: Object.values(EDUCATION_TYPES).map((item) => item.enumValue),
                        required: true,
                    },
                },
            ],
            required: true,
            _id: false,
            default: [],
        },
        medical_license: {
            type: String,
            required: true,
        },
        states_of_licensure: {
            type: [
                {
                    state: {
                        type: String,
                        required: true,
                    },
                    license_number: {
                        type: String,
                        required: true,
                    },
                },
            ],
            required: true,
            _id: false,
            default: [],
        },
        malpractice_insurance_details: {
            type: {
                provider: {
                    type: String,
                    required: true,
                },
                policy_number: {
                    type: String,
                    required: true,
                },
                coverage_amount_in_dollars: {
                    type: Number,
                    required: true,
                },
            },
            required: true,
            _id: false,
        },
        services_provided: {
            type: {
                procedures: {
                    type: [String],
                    required: true,
                    default: [],
                },
                conditions_treated: {
                    type: [String],
                    required: true,
                    default: [],
                },
            },
            required: true,
            _id: false,
        },
        awards: {
            type: [
                {
                    title: {
                        type: String,
                        required: true,
                    },
                    year: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            required: true,
            _id: false,
            default: [],
        },
        publication: {
            type: [
                {
                    title: {
                        type: String,
                        required: true,
                    },
                    year: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            required: true,
            _id: false,
            default: [],
        },
        user_ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
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

export default mongoose.model<IDoctorProfile>("doctor-profiles", doctorProfileSchema);
