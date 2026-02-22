import { User } from "../models/User.js";
import { Store } from "../models/Store.js";
import { Rating } from "../models/Rating.js";

export const getSystemStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const storeCount = await Store.count();
    const ratingCount = await Rating.count();
    
    return res.json({
      stats: {
        users: userCount,
        stores: storeCount,
        ratings: ratingCount
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
