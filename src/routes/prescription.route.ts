import { Router } from "express";
import { CONFIGS } from "@/configs";
import auth from "@/middleware/auth.middleware";
import PrescriptionCtrl from "@/controllers/prescription.controller";

const router: Router = Router();

router.post("/create", auth(CONFIGS.APP_ROLES.DOCTOR), PrescriptionCtrl.create);

router.get("/:prescriptionId", auth(CONFIGS.APP_ROLES.USER), PrescriptionCtrl.getOneById);

router.get("/appointment/:appointmentId", auth(CONFIGS.APP_ROLES.USER), PrescriptionCtrl.getOneByAppointmentId);

export default router;
