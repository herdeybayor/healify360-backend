import { Router } from "express";
import { CONFIGS } from "@/configs";
import auth from "@/middleware/auth.middleware";
import DoctorCtrl from "@/controllers/doctor.controller";

const router: Router = Router();

router.post("/profile/create", auth(CONFIGS.APP_ROLES.DOCTOR), DoctorCtrl.createProfile);

router.get("/profile/get", auth(CONFIGS.APP_ROLES.DOCTOR), DoctorCtrl.getUserProfile);

export default router;
