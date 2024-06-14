import express, { Router } from "express";

import trimIncomingRequests from "@/middleware/trim-incoming.middleware";

import authRoutes from "@/routes/auth.route";
import doctorRoutes from "@/routes/doctor.route";
import patientRoutes from "@/routes/patient.route";

const router: Router = express.Router();

router.use(trimIncomingRequests);

router.use("/auth", authRoutes);

router.use("/doctors", doctorRoutes);

router.use("/patients", patientRoutes);

export default router;
