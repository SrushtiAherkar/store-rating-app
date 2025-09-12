import { Store } from "../models/Store.js";
import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { Op } from "sequelize";

export const createStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  if (!name) return res.status(400).json({ message: "Store name required" });
  try {
    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    return res.json({ store });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getStores = async (req, res) => {
  const { q, sortBy = "name", order = "ASC", page = 1, limit = 50 } = req.query;
  const where = {};
  if (q) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { address: { [Op.iLike]: `%${q}%` } }
    ];
  }
  try {
    const stores = await Store.findAll({
      where,
      include: [
        { model: Rating, as: "ratings", attributes: ["value","userId"] },
        { model: User, as: "owner", attributes: ["id","name","email"] }
      ],
      order: [[sortBy, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
      limit: parseInt(limit),
      offset: (parseInt(page)-1)*parseInt(limit)
    });

    const result = stores.map(s => {
      const values = s.ratings.map(r => r.value);
      const avg = values.length ? (values.reduce((a,b)=>a+b,0)/values.length) : 0;
      return {
        id: s.id, name: s.name, email: s.email, address: s.address, owner: s.owner,
        averageRating: Number(avg.toFixed(2)),
        totalRatings: values.length
      };
    });
    return res.json({ stores: result });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        { model: Rating, as: "ratings", include: [{ model: User, as: "user", attributes: ["id","name","email"] }] },
        { model: User, as: "owner", attributes: ["id","name","email"] }
      ]
    });
    if (!store) return res.status(404).json({ message: "Store not found" });
    const values = store.ratings.map(r => r.value);
    const avg = values.length ? (values.reduce((a,b)=>a+b,0)/values.length) : 0;
    return res.json({ store, averageRating: Number(avg.toFixed(2)) });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
