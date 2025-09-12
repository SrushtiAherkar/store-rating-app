import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { Store } from "../models/Store.js";

// ✅ create a rating by a logged-in user
export const createRating = async (req, res) => {
  const { storeId, value, comment } = req.body;

  if (!storeId || !value) {
    return res.status(400).json({ message: "Missing field" });
  }

  try {
    const rating = await Rating.create({
      storeId,
      userId: req.user.id,  // ✅ from logged-in token
      value,
      comment
    });

    res.json({ rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating rating", error: err.message });
  }
};

// ✅ get ratings for a store (for owner)
export const getRatingsForStore = async (req, res) => {
  const { storeId } = req.params;

  try {
    const ratings = await Rating.findAll({
      where: { storeId },
      include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }]
    });

    const average =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b.value, 0) / ratings.length
        : 0;

    res.json({ ratings, averageRating: average });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ratings", error: err.message });
  }
};

// ✅ get all ratings by a user (optional, for profile)
export const getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { userId: req.user.id },
      include: [{ model: Store, as: "store", attributes: ["id","name"] }]
    });
    res.json({ ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ratings", error: err.message });
  }
};
