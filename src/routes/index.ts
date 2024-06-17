import express, { Router } from "express";

import trimIncomingRequests from "@/middleware/trim-incoming.middleware";

import authRoutes from "@/routes/auth.route";
import userRoutes from "@/routes/user.route";
import doctorRoutes from "@/routes/doctor.route";
import patientRoutes from "@/routes/patient.route";
import appointmentRoutes from "@/routes/appointment.route";
import prescriptionRoutes from "@/routes/prescription.route";

const router: Router = express.Router();

router.use(trimIncomingRequests);

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/doctors", doctorRoutes);

router.use("/patients", patientRoutes);

router.use("/appointments", appointmentRoutes);

router.use("/prescriptions", prescriptionRoutes);

export default router;
