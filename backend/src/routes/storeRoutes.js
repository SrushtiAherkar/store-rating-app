import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeRole.js";
import { createStore, getStoreById } from "../controllers/storeController.js";
import { Store } from "../models/Store.js";
import { User } from "../models/User.js";

const router = express.Router();

// ✅ Admin can create new stores
router.post("/", authenticate, authorize("admin"), createStore);

// ✅ Everyone who is logged in can get all stores (Admin Dashboard)
router.get("/", authenticate, async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email", "role"]
        }
      ]
    });
    res.json({ stores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores" });
  }
});

// ✅ Get store by ID
router.get("/:id", authenticate, getStoreById);

export default router;
