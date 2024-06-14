import express, { Router } from "express";

import trimIncomingRequests from "@/middleware/trim-incoming.middleware";

import authRoutes from "@/routes/auth.route";

const router: Router = express.Router();

router.use(trimIncomingRequests);

router.use("/auth", authRoutes);

export default router;
