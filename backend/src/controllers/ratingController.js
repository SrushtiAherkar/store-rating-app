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
}

// ✅ update a rating
export const updateRating = async (req, res) => {
  const { id } = req.params; // rating id
  const { value, comment } = req.body;

  try {
    const rating = await Rating.findByPk(id);
    if (!rating) return res.status(404).json({ message: "Rating not found" });

    // check ownership
    if (rating.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (value) rating.value = value;
    if (comment !== undefined) rating.comment = comment;

    await rating.save();
    res.json({ rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating rating", error: err.message });
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
      include: [{ model: Store, as: "store", attributes: ["id", "name"] }]
    });
    res.json({ ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ratings", error: err.message });
  }
};
