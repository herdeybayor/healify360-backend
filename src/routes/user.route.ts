import { Router } from "express";
import UserCtrl from "@/controllers/user.controller";

const router: Router = Router();

router.post("/session", UserCtrl.getSession);

export default router;
