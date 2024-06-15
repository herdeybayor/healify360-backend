import JWT from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { CONFIGS } from "@/configs";
import User from "@/models/user.model";
import CustomError from "@/utilities/custom-error";
import DoctorProfile from "@/models/doctor-profile.model";
import PatientProfile from "@/models/patient-profile.model";

function auth(roles: string[] = []) {
    roles = roles.length > 0 ? roles : CONFIGS.APP_ROLES.USER;

    return async (req: Request, _res: Response, next: NextFunction) => {
        if (!req.headers.authorization) throw new CustomError("unauthorized access: token not found", 401);

        const token: string = req.headers.authorization.split(" ")[1] || "";

        const decoded: any = JWT.verify(token, CONFIGS.JWT_SECRET, (err: any, decoded: any) => {
            if (err) throw new CustomError("-middleware/token-expired", 401);
            return decoded;
        });

        const user = await User.findOne({ _id: decoded._id });
        if (!user) throw new CustomError("-middleware/user-not-found", 401);

        if (!roles.includes(user.role)) throw new CustomError("-middleware/user-not-authorized", 401);

        req.$currentUser = user;

        if (user.role === "doctor") {
            const doctorProfile = await DoctorProfile.findOne({ user_ref: user._id });
            if (doctorProfile) {
                req.$currentDoctorProfile = doctorProfile;
            }
        }

        if (user.role === "patient") {
            const patientProfile = await PatientProfile.findOne({ user_ref: user._id });
            if (patientProfile) {
                req.$currentPatientProfile = patientProfile;
            }
        }

        next();
    };
}

export default auth;
