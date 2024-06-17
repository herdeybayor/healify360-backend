import { Router } from "express";
import { CONFIGS } from "@/configs";
import auth from "@/middleware/auth.middleware";
import UserCtrl from "@/controllers/user.controller";

const router: Router = Router();

router.post("/session", auth(CONFIGS.APP_ROLES.USER), UserCtrl.getSession);

export default router;
