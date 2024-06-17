import Joi from "joi";
import { Request } from "express";

import MessageModel from "@/models/message.model";
import CustomError from "@/utilities/custom-error";
import AppointmentModel from "@/models/appointment.model";

class MessageService {
    async create({ body, $currentUser }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                message: Joi.string().required(),
                appointment_id: Joi.string().required(),
            }).required(),
            $currentUser: Joi.object({
                id: Joi.string().required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ body, $currentUser });
        if (error) throw new CustomError(error.message, 400);

        const appointment = await AppointmentModel.findOne({ _id: data.body.appointment_id });
        if (!appointment) throw new CustomError("appointment not found", 404);

        if (String(appointment.patient_ref) !== data.$currentUser.id && String(appointment.doctor_ref) !== data.$currentUser.id) {
            throw new CustomError("unauthorized access, you are not part of this appointment", 403);
        }

        const createContext = {
            message: data.body.message,
            appointment_ref: appointment._id,
            sender_ref: data.$currentUser.id,
        };

        const message = await new MessageModel(createContext).save();

        return message;
    }
}

export default new MessageService();
