import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.productId");
    res.json(cart || { items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [], total: 0 });
    }

    cart.items.push({ productId, quantity: 1 });
    cart.total = (cart.total || 0) + product.price;

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

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({ message: "Item removed successfully", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
