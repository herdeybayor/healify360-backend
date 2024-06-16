import { Request, Response } from "express";

import response from "@/utilities/response";
import PrescriptionService from "@/services/prescription.service";

class PrescriptionController {
    async create(req: Request, res: Response) {
        const result = await PrescriptionService.create(req);
        res.status(201).send(response("prescription created", result));
    }

    async getOneById(req: Request, res: Response) {
        const result = await PrescriptionService.getOneById(req);
        res.send(response("prescription found", result));
    }

    async getOneByAppointmentId(req: Request, res: Response) {
        const result = await PrescriptionService.getOneByAppointmentId(req);
        res.send(response("prescription found", result));
    }
}

export default new PrescriptionController();
