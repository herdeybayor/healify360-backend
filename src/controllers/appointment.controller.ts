import { Request, Response } from "express";

import response from "@/utilities/response";
import AppointmentService from "@/services/appointment.service";

class AppointmentController {
    async bookAppointment(req: Request, res: Response) {
        const result = await AppointmentService.bookAppointment(req);
        res.status(201).send(response("appointment booked", result));
    }
}

export default new AppointmentController();
