import { Request, Response } from "express";

import response from "@/utilities/response";
import PatientService from "@/services/patient.service";

class PatientController {
    async createProfile(req: Request, res: Response) {
        const result = await PatientService.createProfile(req);
        res.status(201).send(response("patient profile created", result));
    }

    async getUserProfile(req: Request, res: Response) {
        const result = await PatientService.getUserProfile(req);
        res.status(200).send(response("patient profile retrieved", result));
    }
}

export default new PatientController();
