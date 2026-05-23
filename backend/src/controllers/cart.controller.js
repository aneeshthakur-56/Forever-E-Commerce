import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import apiHandler from "../utils/apiHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// 1. Get User Cart
export const getUserCart = apiHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  res
    .status(200)
    .json(
      new ApiResponse(200, "Cart fetched successfully", user.cartData || {}),
    );
});

// 2. Add To Cart
export const addToCart = apiHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { itemId, size } = req.body;
  if (!itemId || !size) throw new ApiError(400, "itemId and size are required");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Plain object — no await
  const cartData = user.cartData || {};

  if (cartData[itemId]) {
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
  } else {
    cartData[itemId] = { [size]: 1 };
  }
  await User.findByIdAndUpdate(userId, { $set: { cartData } });
  res.status(200).json(new ApiResponse(200, "Product added to cart"));
});

// 3. Update Cart
export const updateCart = apiHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { itemId, size, quantity } = req.body;
  if (!itemId || !size || quantity === undefined) {
    throw new ApiError(400, "itemId, size and quantity are required");
  }
  if (quantity < 0) throw new ApiError(400, "Quantity cannot be negative");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const cartData = user.cartData || {};

  if (quantity === 0) {
    if (cartData[itemId]) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }
  } else {
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;
  }

  await User.findByIdAndUpdate(userId, { $set: { cartData } });

  res.status(200).json(new ApiResponse(200, "Cart updated successfully"));
});
