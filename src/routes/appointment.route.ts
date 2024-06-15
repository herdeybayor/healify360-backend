import { Router } from "express";
import { CONFIGS } from "@/configs";
import auth from "@/middleware/auth.middleware";
import AppointmentCtrl from "@/controllers/appointment.controller";

const router: Router = Router();

router.post("/book", auth(CONFIGS.APP_ROLES.PATIENT), AppointmentCtrl.bookAppointment);

export default router;
