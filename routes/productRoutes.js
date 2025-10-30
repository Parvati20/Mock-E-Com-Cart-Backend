import express from "express";
import Product from "../models/Product.js";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/seed", async (req, res) => {
  try {
    const { data } = await axios.get("https://fakestoreapi.com/products");

    await Product.deleteMany();

    const created = await Product.insertMany(
      data.map((item) => ({
        name: item.title,
        price: item.price,
        description: item.description,
        image: item.image,
        category: item.category,
      }))
    );

    res.json({ message: "Products added successfully!", count: created.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

