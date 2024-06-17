import Joi from "joi";
import { Request } from "express";

import UserModel from "@/models/user.model";
import MessageModel from "@/models/message.model";
import CustomError from "@/utilities/custom-error";
import AppointmentModel from "@/models/appointment.model";
import { authenticateUser, authorizeChannel, trigger } from "@/libraries/pusher";

class MessageService {
    async create({ body, $currentUser }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                message: Joi.string().required(),
                socket_id: Joi.string().optional(),
                appointment_id: Joi.string().required(),
            }).required(),
            $currentUser: Joi.object({
                _id: Joi.required(),
                role: Joi.string().valid("doctor", "patient").required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ body, $currentUser });
        if (error) throw new CustomError(error.message, 400);

        const appointment = await AppointmentModel.findOne({ _id: data.body.appointment_id });
        if (!appointment) throw new CustomError("appointment not found", 404);

        if (String(appointment.patient_ref) !== String(data.$currentUser._id) && String(appointment.doctor_ref) !== String(data.$currentUser._id)) {
            throw new CustomError("unauthorized access, you are not part of this appointment", 403);
        }

        const createContext = {
            message: data.body.message,
            sent_by: data.$currentUser.role,
            appointment_ref: appointment._id,
            sender_ref: data.$currentUser._id,
            doctor_profile_ref: appointment.doctor_profile_ref,
            patient_profile_ref: appointment.patient_profile_ref,
        };

        const message = await new MessageModel(createContext).save();

        const params: Record<string, any> = {};
        if (data.body.socket_id) params.socket_id = data.body.socket_id;

        await trigger(`presence-inbox-${String(appointment._id)}`, "new-message", message, params);

        return message;
    }

    async getAllByAppointmentId({ query, params, $currentUser }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            query: Joi.object({
                page: Joi.number().default(1),
                limit: Joi.number().default(10),
            }).required(),
            params: Joi.object({
                appointment_id: Joi.string().required(),
            }).required(),
            $currentUser: Joi.object({
                _id: Joi.required(),
                role: Joi.string().valid("doctor", "patient").required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ query, params, $currentUser });
        if (error) throw new CustomError(error.message, 400);

        const appointment = await AppointmentModel.findOne({ _id: data.params.appointment_id });
        if (!appointment) throw new CustomError("appointment not found", 404);

        if (String(appointment.patient_ref) !== String(data.$currentUser._id) && String(appointment.doctor_ref) !== String(data.$currentUser._id)) {
            throw new CustomError("unauthorized access, you are not part of this appointment", 403);
        }

        const options = {
            page: data.query.page,
            limit: data.query.limit,
            sort: { created_at: -1 },
            populate: [
                { path: "sender_ref", select: "first_name last_name profile_picture" },
                { path: "doctor_profile_ref", select: "full_name" },
                { path: "patient_profile_ref", select: "full_name" },
            ],
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

        const filter: Record<string, any> = {
            appointment_ref: appointment._id,
        };

        const { docs, ...pagination } = await MessageModel.paginate(filter, options);

        return { messages: docs, pagination };
    }

    async pusherAuthenticateUser({ body, $currentUser }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                socket_id: Joi.string().required(),
            }).required(),
            $currentUser: Joi.object({
                _id: Joi.required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ body, $currentUser });
        if (error) throw new CustomError(error.message, 400);

        const user = await UserModel.findOne({ _id: data.$currentUser._id });
        if (!user) throw new CustomError("user not found", 404);

        const payload = {
            id: String(user._id),
            user_info: { ...user, _id: String(user._id), password: undefined },
        };

        const userAuthResponse = authenticateUser(data.body.socket_id, payload);

        return userAuthResponse;
    }

    async pusherAuthorizeChannel({ body, $currentUser }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                socket_id: Joi.string().required(),
                channel_name: Joi.string().required(),
            }).required(),
            $currentUser: Joi.object({
                _id: Joi.required(),
            }).required(),
        })
            .options({ stripUnknown: true })
            .validate({ body, $currentUser });
        if (error) throw new CustomError(error.message, 400);

        const channelNameParts = data.body.channel_name.split("-");
        const appointmentId = channelNameParts[channelNameParts.length - 1];

        const appointment = await AppointmentModel.findOne({ _id: appointmentId });
        if (!appointment) throw new CustomError("appointment not found", 404);

        const user = await UserModel.findOne({ _id: data.$currentUser._id });
        if (!user) throw new CustomError("user not found", 404);

        const userObjectFormatted = {
            user_id: String(user._id),
            user_info: { ...user, _id: String(user._id), password: undefined },
        };

        const authResponse = authorizeChannel(data.body.socket_id, data.body.channel_name, userObjectFormatted);

        return authResponse;
    }
}

export default new MessageService();
