import Joi from "joi";
import { Request } from "express";

import CustomError from "@/utilities/custom-error";
import AppointmentModel from "@/models/appointment.model";
import DoctorProfileModel from "@/models/doctor-profile.model";

class AppointmentService {
    async createAppointment({ body, $currentUser, $currentPatientProfile }: Request) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                message: Joi.string().required(),
                date_time: Joi.date().required(),
                doctor_id: Joi.string().required(),
            }),
            $currentUser: Joi.object({
                _id: Joi.required(),
            }).required(),
            $currentPatientProfile: Joi.object({
                _id: Joi.required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ body, $currentUser, $currentPatientProfile });
        if (error) throw new CustomError(error.message, 400);

        const doctorProfile = await DoctorProfileModel.findOne({ user_ref: data.body.doctor_id });
        if (!doctorProfile) throw new CustomError("doctor not found", 404);

        const createContext = {
            message: data.body.message,
            date_time: data.body.date_time,

            doctor_ref: data.body.doctor_ref,
            doctor_profile_ref: doctorProfile._id,

            patient_ref: data.$currentUser._id,
            patient_profile_ref: data.$currentPatientProfile._id,
        };

        const appointment = await new AppointmentModel(createContext).save();

        return appointment;
    }
}

export default AppointmentService;
