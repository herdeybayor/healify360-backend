import Joi from "joi";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { Request } from "express";

import { CONFIGS } from "@/configs";
import UserModel from "@/models/user.model";
import CustomError from "@/utilities/custom-error";

class AuthService {
    async register({ body }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                password: Joi.string().required(),
                email: Joi.string().email().required(),
                role: Joi.string().valid("patient", "doctor", "admin").default("patient"),
            }),
        })
            .options({ stripUnknown: true })
            .validate({ body });
        if (error) throw new CustomError(error.message, 400);

        const existingUserEmail = await UserModel.findOne({ email: data.body.email });
        if (existingUserEmail) throw new CustomError("user email already exists", 409);

        const passwordHash = await bcrypt.hash(data.body.password, CONFIGS.BCRYPT_SALT);

        const createContext = {
            ...data.body,
            password: passwordHash,
        };

        const user = await UserModel.create(createContext);
        user.password = undefined;

        const accessToken = JWT.sign({ _id: user._id }, CONFIGS.JWT_SECRET, { expiresIn: CONFIGS.ACCESS_TOKEN_JWT_EXPIRES_IN / 1000 });

        return { user, token: { access_token: accessToken } };
    }

    async login({ body }: Partial<Request>) {
        const { error, value: data } = Joi.object({
            body: Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            }),
        })
            .options({ stripUnknown: true })
            .validate({ body });
        if (error) throw new CustomError(error.message, 400);

        const user = await UserModel.findOne({ email: data.body.email }).select("+password");
        if (!user) throw new CustomError("user not found", 404);

        const isPasswordValid = await bcrypt.compare(data.body.password, user.password || "");
        if (!isPasswordValid) throw new CustomError("invalid password", 401);

        const accessToken = JWT.sign({ _id: user._id }, CONFIGS.JWT_SECRET, { expiresIn: CONFIGS.ACCESS_TOKEN_JWT_EXPIRES_IN / 1000 });

        return { user, token: { access_token: accessToken } };
    }
}

export default new AuthService();
