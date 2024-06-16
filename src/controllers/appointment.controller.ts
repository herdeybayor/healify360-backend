import { Request, Response } from "express";

import response from "@/utilities/response";
import AppointmentService from "@/services/appointment.service";

class AppointmentController {
    async bookAppointment(req: Request, res: Response) {
        const result = await AppointmentService.bookAppointment(req);
        res.status(201).send(response("appointment booked", result));
    }

    async getOneAppointment(req: Request, res: Response) {
        const result = await AppointmentService.getOneAppointment(req);
        res.status(200).send(response("appointment retrieved", result));
    }

    async updateAppointmentStatus(req: Request, res: Response) {
        const result = await AppointmentService.updateAppointmentStatus(req);
        res.status(200).send(response("appointment status updated", result));
    }
}

export default new AppointmentController();
