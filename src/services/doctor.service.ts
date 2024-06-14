import Joi from "joi";
import { Request } from "express";

import CustomError from "@/utilities/custom-error";
import DoctorProfileModel, { SPECIALIZATION, EDUCATION_TYPES } from "@/models/doctor-profile.model";

class DoctorService {
    async createProfile({ body, $currentUser }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                bio: Joi.string().required(),
                full_name: Joi.string().required(),
                date_of_birth: Joi.date().required(),
                gender: Joi.string().valid("M", "F", "R").required(),
                years_of_experience: Joi.number().required(),
                home_address: Joi.object({
                    city: Joi.string().required(),
                    state: Joi.string().required(),
                    street: Joi.string().required(),
                    country: Joi.string().required(),
                }).required(),
                phone_number: Joi.object({
                    code: Joi.string().required(),
                    number: Joi.string().required(),
                }).required(),
                specialization: Joi.string()
                    .valid(...Object.keys(SPECIALIZATION))
                    .required(),
                sub_specialization: Joi.string()
                    .valid(...Object.values(SPECIALIZATION).flat())
                    .required(),
                education: Joi.array().items(
                    Joi.object({
                        year: Joi.number().required(),
                        institution: Joi.string().required(),
                        field_of_study: Joi.string().required(),
                        degree: Joi.string()
                            .valid(...Object.values(EDUCATION_TYPES).map((v) => v.enumValue))
                            .required(),
                    })
                ),
                medical_license: Joi.string().required(),
                states_of_licensure: Joi.array().items(
                    Joi.object({
                        state: Joi.string().required(),
                        license_number: Joi.string().required(),
                    })
                ),
                malpractice_insurance_details: Joi.object({
                    provider: Joi.string().required(),
                    policy_number: Joi.string().required(),
                    coverage_amount_in_dollars: Joi.number().required(),
                }),
                services_provided: Joi.object({
                    procedures: Joi.array().items(Joi.string()).required(),
                    conditions_treated: Joi.array().items(Joi.string()).required(),
                }),
                awards: Joi.array().items(
                    Joi.object({
                        title: Joi.string().required(),
                        year: Joi.number().required(),
                    })
                ),
                publication: Joi.array().items(
                    Joi.object({
                        title: Joi.string().required(),
                        year: Joi.number().required(),
                    })
                ),
            }),
            $currentUser: Joi.object({
                _id: Joi.required(),
                role: Joi.string().required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ body, $currentUser });
        if (error) throw new CustomError(error.message, 400);
        console.log(data.$currentUser);
        if (data.$currentUser.role !== "doctor") throw new CustomError(`only doctors can create doctor profile: ${data.$currentUser.role}`, 403);

        const existingProfile = await DoctorProfileModel.findOne({ user_ref: data.$currentUser._id });
        console.log("B");
        if (existingProfile) throw new CustomError("profile already exists", 409);

        const createContext = {
            ...data.body,
            user_ref: data.$currentUser._id,
        };

        const profile = await new DoctorProfileModel(createContext).save();

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

        if (data.$currentUser.role !== "doctor") throw new CustomError(`only doctors can get doctor profile: ${data.$currentUser.role}`, 403);

        const profile = await DoctorProfileModel.findOne({ user_ref: data.$currentUser._id });

        return profile;
    }
}

export default new DoctorService();
