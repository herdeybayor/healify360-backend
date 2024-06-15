import { Router } from "express";
import AppointmentCtrl from "@/controllers/appointment.controller";

const router: Router = Router();

router.post("/book", AppointmentCtrl.bookAppointment);

export default router;
