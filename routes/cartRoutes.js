import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne();
    res.json(cart || { items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [], total: 0 });
    }

    cart.items.push({ productId });
    await cart.save();

    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    let cart = await Cart.findOne();

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    if (!Array.isArray(cart.items)) {
      cart.items = [];
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({
      message: "Item removed successfully",
      cart,
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
