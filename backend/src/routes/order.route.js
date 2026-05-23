import { Router } from "express";
import {
  placeOrder,
  placeOrderRazor,
  verifyRazorpay,
  getAdminOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authUser, authAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Admin routes
router.get("/list",                    authAdmin, getAdminOrders);
router.patch("/status/:orderId",       authAdmin, updateOrderStatus);

// User routes
router.get("/user",                    authUser, getUserOrders);
router.post("/place",                  authUser, placeOrder);

// Payment routes
router.post("/razor",                  authUser, placeOrderRazor);
router.post("/verify-razorpay",        authUser, verifyRazorpay);

export { router as orderRouter };