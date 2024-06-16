import Joi from "joi";
import { Request } from "express";

import CustomError from "@/utilities/custom-error";
import { parseDate } from "@/utilities/helpful-methods";
import AppointmentModel from "@/models/appointment.model";
import DoctorProfileModel from "@/models/doctor-profile.model";

class AppointmentService {
    async bookAppointment({ body, $currentUser, $currentPatientProfile }: Request) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                message: Joi.string().required(),
                date_time: Joi.string().required(),
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
            date_time: parseDate(data.body.date_time),

            doctor_ref: data.body.doctor_id,
            doctor_profile_ref: doctorProfile._id,

            patient_ref: data.$currentUser._id,
            patient_profile_ref: data.$currentPatientProfile._id,
        };

        // check if doctor is available at the specified date and time
        const existingAppointment = await AppointmentModel.findOne({ doctor_ref: createContext.doctor_ref, date_time: createContext.date_time });
        if (existingAppointment) throw new CustomError("doctor is not available at the specified date and time", 400);

        const appointment = await new AppointmentModel(createContext).save();

        return appointment;
    }

    async getOneAppointment({ params, $currentUser }: Request) {
        const { error, value: data } = Joi.object({
            params: Joi.object({
                appointmentId: Joi.string().required(),
            }),
            $currentUser: Joi.object({
                _id: Joi.required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ params, $currentUser });
        if (error) throw new CustomError(error.message, 400);

        const appointment = await AppointmentModel.findOne({ _id: data.params.appointmentId });
        if (!appointment) throw new CustomError("appointment not found", 404);

        // current user must be the patient who booked the appointment or the doctor who is to attend to the patient
        if (String(appointment.patient_ref) !== String(data.$currentUser._id) && String(appointment.doctor_ref) !== String(data.$currentUser._id)) {
            throw new CustomError("can not access appointment", 403);
        }

        return appointment;
    }
}

export default new AppointmentService();
