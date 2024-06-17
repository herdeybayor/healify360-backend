import { Request, Response } from "express";

import response from "@/utilities/response";
import UserService from "@/services/user.service";

class UserController {
    async getSession(req: Request, res: Response) {
        const result = await UserService.getSession(req);
        res.status(200).send(response("user session retrieved", result));
    }
}

export default new UserController();
