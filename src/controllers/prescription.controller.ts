import { Request, Response } from "express";

import response from "@/utilities/response";
import PrescriptionService from "@/services/prescription.service";

class PrescriptionController {
    async create(req: Request, res: Response) {
        const result = await PrescriptionService.create(req);
        res.status(201).send(response("prescription created", result));
    }
}

export default new PrescriptionController();
