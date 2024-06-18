import Joi from "joi";
import { Request } from "express";

import UserModel from "@/models/user.model";
import CustomError from "@/utilities/custom-error";
import PatientProfileModel, { ETHNICITY } from "@/models/patient-profile.model";

class PatientService {
    async createProfile({ body, $currentUser }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                full_name: Joi.string().required(),
                date_of_birth: Joi.date().required(),
                gender: Joi.string().valid("M", "F", "R").required(),
                phone_number: Joi.object({
                    code: Joi.string().required(),
                    number: Joi.string().required(),
                }).required(),
                major_illnesses: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        period: Joi.date().required(),
                    })
                ),
                surgeries: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        period: Joi.date().required(),
                    })
                ),
                allergies: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        reaction: Joi.string().required(),
                    })
                ),
                family_medical_history: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        illness: Joi.string().required(),
                        relationship: Joi.string().required(),
                    })
                ),
                current_medications: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        dosage: Joi.string().required(),
                        frequency: Joi.string().required(),
                    })
                ),
                home_address: Joi.object({
                    city: Joi.string().required(),
                    state: Joi.string().required(),
                    street: Joi.string().required(),
                    country: Joi.string().required(),
                }).required(),
                insurance_information: Joi.object({
                    provider: Joi.string().required(),
                    policy_number: Joi.string().required(),
                    group_number: Joi.string().required(),
                }),
                emergency_contact: Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().email().required(),
                    phone: Joi.string().required(),
                    relationship: Joi.string().required(),
                }),
                preferences: Joi.object({
                    languages: Joi.array()
                        .items(
                            Joi.object({
                                language: Joi.string().required(),
                                proficiency: Joi.string().required(),
                            })
                        )
                        .required(),
                    communication_preferences: Joi.array()
                        .items(
                            Joi.object({
                                preference: Joi.string().required(),
                            })
                        )
                        .required(),
                    accessibility_needs: Joi.array()
                        .items(
                            Joi.object({
                                need: Joi.string().required(),
                            })
                        )
                        .required(),
                }),
                occupation: Joi.string().allow(null),
                ethnicity: Joi.string().valid(...Object.values(ETHNICITY).map((v) => v.enumValue)),
            }),
            $currentUser: Joi.object({
                _id: Joi.required(),
                role: Joi.string().required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ body, $currentUser });
        if (error) throw new CustomError(error.message, 400);

        if (data.$currentUser.role !== "patient") throw new CustomError(`only patients can create patients profile: ${data.$currentUser.role}`, 403);

        const existingProfile = await PatientProfileModel.findOne({ user_ref: data.$currentUser._id });
        if (existingProfile) throw new CustomError("profile already exists", 409);

        const createContext = {
            ...data.body,
            user_ref: data.$currentUser._id,
        };

        const profile = await new PatientProfileModel(createContext).save();

        await UserModel.updateOne({ _id: data.$currentUser._id }, { is_onboarding_complete: true });

        return profile;
    }

    async getUserProfile({ $currentUser }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            $currentUser: Joi.object({
                _id: Joi.required(),
                role: Joi.string().required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ $currentUser });
        if (error) throw new CustomError(error.message, 400);

        if (data.$currentUser.role !== "patient") throw new CustomError(`only patients can get their profile: ${data.$currentUser.role}`, 403);

        const profile = await PatientProfileModel.findOne({ user_ref: data.$currentUser._id });
        if (!profile) throw new CustomError("profile not found", 404);

        return profile;
    }
}

export default new PatientService();
