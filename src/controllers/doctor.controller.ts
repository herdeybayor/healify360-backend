import { Request, Response } from "express";

import response from "@/utilities/response";
import DoctorService from "@/services/doctor.service";

class DoctorController {
    async createProfile(req: Request, res: Response) {
        const result = await DoctorService.createProfile(req);
        res.status(201).send(response("doctor profile created", result));
    }

    async getUserProfile(req: Request, res: Response) {
        const result = await DoctorService.getUserProfile(req);
        res.status(200).send(response("doctor profile retrieved", result));
    }

    async getDashboard(req: Request, res: Response) {
        const result = await DoctorService.getDashboard(req);
        res.status(200).send(response("doctor dashboard retrieved", result));
    }
}

export default new DoctorController();
