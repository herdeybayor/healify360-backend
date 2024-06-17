import Joi from "joi";
import { Request } from "express";

import CustomError from "@/utilities/custom-error";
import PrescriptionModel from "@/models/prescription.model";
import AppointmentModel, { APPOINTMENT_STATUS } from "@/models/appointment.model";
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

        if (data.$currentUser.role !== "doctor") throw new CustomError(`only doctors can create doctor profile: ${data.$currentUser.role}`, 403);

        const existingProfile = await DoctorProfileModel.findOne({ user_ref: data.$currentUser._id });
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
        if (!profile) throw new CustomError("profile not found", 404);

        return profile;
    }

    async getDashboard({ $currentUser }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            $currentUser: Joi.object({
                _id: Joi.required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ $currentUser });
        if (error) throw new CustomError(error.message, 400);

        const totalConsultations = await AppointmentModel.countDocuments({ doctor_ref: data.$currentUser._id });
        const totalPrescriptionsSent = await PrescriptionModel.countDocuments({ doctor_ref: data.$currentUser._id });
        const upcomingAppointmentsCount = await AppointmentModel.countDocuments({ status: APPOINTMENT_STATUS.PENDING.enumValue, doctor_ref: data.$currentUser._id });

        const upcomingAppointments = await AppointmentModel.find({ status: APPOINTMENT_STATUS.PENDING.enumValue, doctor_ref: data.$currentUser._id });

        return {
            total_consultations: totalConsultations,
            total_prescriptions_sent: totalPrescriptionsSent,
            upcoming_appointments_count: upcomingAppointmentsCount,
            upcoming_appointments: upcomingAppointments,
        };
    }

    async findDoctors({ query }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            query: Joi.object({
                page: Joi.number().default(1),
                limit: Joi.number().default(10),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ query });
        if (error) throw new CustomError(error.message, 400);

        const options = {
            page: data.query.page,
            limit: data.query.limit,
            sort: { log_timestamp: -1 },
            populate: { path: "user_ref", select: { _id: 1, email: 1 } },
            customLabels: {
                prevPage: "prev_page",
                nextPage: "next_page",
                totalDocs: "total_docs",
                totalPages: "total_pages",
                hasPrevPage: "has_prev_page",
                hasNextPage: "has_next_page",
                pagingCounter: "paging_counter",
            },
        };

        const filter: Record<string, any> = {};

        const { docs, ...pagination } = await DoctorProfileModel.paginate(filter, options);

        return { doctors: docs, pagination };
    }
}

export default new DoctorService();
