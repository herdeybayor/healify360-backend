import { Request } from "express";

import CustomError from "@/utilities/custom-error";

class UserService {
    async getSession({ $currentUser }: Partial<Request>) {
        if (!$currentUser) throw new CustomError("user not found", 404);

        return $currentUser;
    }
}

export default new UserService();
