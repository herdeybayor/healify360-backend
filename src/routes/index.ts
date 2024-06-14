import express, { Router } from "express";

import trimIncomingRequests from "@/middleware/trim-incoming.middleware";

import authRoutes from "@/routes/auth.route";
import doctorRoutes from "@/routes/doctor.route";

const router: Router = express.Router();

router.use(trimIncomingRequests);

router.use("/auth", authRoutes);

router.use("/doctors", doctorRoutes);

export default router;
