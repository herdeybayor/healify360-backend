import { Router } from "express";
import AuthCtrl from "@/controllers/auth.controller";

const router: Router = Router();

router.post("/register", AuthCtrl.register);

router.post("/login", AuthCtrl.login);

export default router;
