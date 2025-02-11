import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { name: String, price: Number },
      quantity: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
