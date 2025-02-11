import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Fetch Orders for a User
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).select("items totalAmount status createdAt");
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Create Order
router.post("/", async (req, res) => {
  try {
    const { userId, items } = req.body;
    const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const newOrder = new Order({ userId, items, totalAmount, status: "pending" });
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

export default router;
