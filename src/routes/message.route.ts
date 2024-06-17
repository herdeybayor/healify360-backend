import { Router } from "express";
import { CONFIGS } from "@/configs";
import auth from "@/middleware/auth.middleware";
import MessageCtrl from "@/controllers/message.controller";

const router: Router = Router();

router.post("/send", auth(CONFIGS.APP_ROLES.USER), MessageCtrl.create);

export default router;
