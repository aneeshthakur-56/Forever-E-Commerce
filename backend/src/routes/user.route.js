import { Router } from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cart.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/get", authUser, getUserCart);
router.post("/add", authUser, addToCart);
router.post("/update", authUser, updateCart);

export { router as cartRouter };
