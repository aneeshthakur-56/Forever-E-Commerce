import apiHandler from "../utils/apiHandler.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";

// 1. Place Order — COD
export const placeOrder = apiHandler(async (req, res) => {
  const userId = req.user?._id;
  const { items, amount, address } = req.body;

  if (!items?.length) throw new ApiError(400, "No items in order");
  if (!amount) throw new ApiError(400, "Amount is required");
  if (!address) throw new ApiError(400, "Address is required");

  const order = await Order.create({
    userId,
    items,
    amount,
    address,
    paymentMethod: "COD",
    payment: false, // COD — collected on delivery
    date: Date.now(),
  });
  await User.findByIdAndUpdate(userId, { $set: { cartData: {} } });
  res
    .status(201)
    .json(
      new ApiResponse(201, "Order placed successfully", { orderId: order._id }),
    );
});


// 2. Place Order — Razorpay (creates order, payment: false until verified)
export const placeOrderRazor = apiHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { items, amount, address } = req.body;

  if (!items?.length) throw new ApiError(400, "No items in order");
  if (!amount) throw new ApiError(400, "Amount is required");
  if (!address) throw new ApiError(400, "Address is required");

  const order = await Order.create({
    userId,
    items,
    amount,
    address,
    paymentMethod: "Razorpay",
    payment: false,
    date: Date.now(),
  });

  const Razorpay = (await import("razorpay")).default;
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const razorOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: "INR",
    receipt: order._id.toString(),
  });

  res.status(200).json(
    new ApiResponse(200, "Razorpay order created", {
      orderId: order._id,
      razorpayOrder: razorOrder,
    }),
  );
});

// 3. Verify Razorpay Payment — sets payment: true after successful payment
export const verifyRazorpay = apiHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing payment verification fields");
  }

  // Verify signature using HMAC SHA256
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    await Order.findByIdAndUpdate(orderId, { payment: false, status: "Cancelled" });
    throw new ApiError(400, "Payment verification failed — invalid signature");
  }

  await Order.findByIdAndUpdate(orderId, { payment: true });
  await User.findByIdAndUpdate(userId, { $set: { cartData: {} } });

  res.status(200).json(new ApiResponse(200, "Payment verified successfully", { orderId }));
});

// 4. Get All Orders — Admin
export const getAdminOrders = apiHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .sort({ date: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, "Orders fetched successfully", orders));
});

// 5. Get User Orders
export const getUserOrders = apiHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  const orders = await Order.find({ userId }).sort({ date: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, "Orders fetched successfully", orders));
});

// 6. Update Order Status — Admin
export const updateOrderStatus = apiHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out For Delivery",
    "Delivered",
    "Cancelled",
  ];

  if (!validStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    );
  }

  const order = await Order.findByIdAndUpdate(orderId, { status });
  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(new ApiResponse(200, "Order status updated", order));
});
