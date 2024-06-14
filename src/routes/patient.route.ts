import { Router } from "express";
import { CONFIGS } from "@/configs";
import auth from "@/middleware/auth.middleware";
import PatientCtrl from "@/controllers/patient.controller";

const router: Router = Router();

router.post("/profile/create", auth(CONFIGS.APP_ROLES.PATIENT), PatientCtrl.createProfile);

router.get("/profile/get", auth(CONFIGS.APP_ROLES.PATIENT), PatientCtrl.getUserProfile);

export default router;
