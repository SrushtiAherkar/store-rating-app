import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeRole.js";
import { getSystemStats } from "../controllers/adminController.js";

const router = express.Router();

// Only admin can access these stats
router.get("/stats", authenticate, authorize(["admin"]), getSystemStats);

export default router;
