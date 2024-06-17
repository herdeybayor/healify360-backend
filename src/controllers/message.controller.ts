import { Request, Response } from "express";

import response from "@/utilities/response";
import MessageService from "@/services/message.service";

class MessageController {
    async create(req: Request, res: Response) {
        const result = await MessageService.create(req);
        res.status(201).send(response("message created", result));
    }

    async pusherAuthenticateUser(req: Request, res: Response) {
        const result = await MessageService.pusherAuthenticateUser(req);
        res.status(200).json(result);
    }

    async pusherAuthorizeChannel(req: Request, res: Response) {
        const result = await MessageService.pusherAuthorizeChannel(req);
        res.status(200).json(result);
    }
}

export default new MessageController();
