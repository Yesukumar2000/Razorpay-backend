import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    });

    res.json({ order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify Payment and Update Order
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, userId } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Cart items are missing or invalid" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Update order as failed
      const failedOrder = new Order({ userId, items: cart, totalAmount: 0, status: "failed" });
      await failedOrder.save();

      return res.status(400).json({ message: "Invalid payment signature, order failed" });
    }

    const totalAmount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const newOrder = new Order({ userId, items: cart, totalAmount, status: "completed" });
    await newOrder.save();

    res.json({ message: "Payment successful & order saved!" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
