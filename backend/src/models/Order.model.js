import { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  name:      { type: String,  required: true },
  price:     { type: Number,  required: true },
  quantity:  { type: Number,  required: true },
  size:      { type: String,  required: true },
  image:     { type: String,  required: true },
});

const orderSchema = new Schema(
  {
    userId: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    items: {
      type:     [orderItemSchema],
      required: true,
    },
    address: {
      type:     Object,
      required: true,
    },
    amount: {
      type:     Number,
      required: true,
    },
    status: {
      type:    String,
      default: "Order Placed",
      enum:    [
        "Order Placed",
        "Packing",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
    },
    paymentMethod: {
      type:     String,
      required: true,
      enum:     ["COD", "Razorpay"],
    },
    payment: {
      type:    Boolean,
      default: false,
    },
    date: {
      type:    Date,  
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);
export default Order;