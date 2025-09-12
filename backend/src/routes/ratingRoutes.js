import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createRating,
  getRatingsForStore,
  getMyRatings
} from "../controllers/ratingController.js";

const router = express.Router();

// user creates a rating
router.post("/", authenticate, createRating);

// owner views all ratings for their store
router.get("/store/:storeId", authenticate, getRatingsForStore);

// user views their own ratings (optional)
router.get("/me", authenticate, getMyRatings);

export default router;
