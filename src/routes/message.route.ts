import { Router } from "express";
import { CONFIGS } from "@/configs";
import auth from "@/middleware/auth.middleware";
import MessageCtrl from "@/controllers/message.controller";

const router: Router = Router();

router.post("/send", auth(CONFIGS.APP_ROLES.USER), MessageCtrl.create);

router.get("/all/:appointment_id", auth(CONFIGS.APP_ROLES.USER), MessageCtrl.getAllByAppointmentId);

router.post("/pusher/authenticate/user", auth(CONFIGS.APP_ROLES.USER), MessageCtrl.pusherAuthenticateUser);

router.post("/pusher/authorize/channel", auth(CONFIGS.APP_ROLES.USER), MessageCtrl.pusherAuthorizeChannel);

export default router;
