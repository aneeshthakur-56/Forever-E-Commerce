import apiHandler from "../utils/apiHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.model.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

// GET /api/user/profile
export const getUserProfile = apiHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password -cartData");
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(
    new ApiResponse(200, "User profile fetched successfully", user)
  );
});

// PUT /api/user/profile
export const updateUserProfile = apiHandler(async (req, res) => {
  const userId = req.user._id;
  const { name } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (name) user.name = name;

  if (req.file) {
    const imageUrl = await uploadToCloudinary(req.file);
    if (!imageUrl) throw new ApiError(500, "Failed to upload image");
    user.profilePicture = imageUrl;
  }

  await user.save();

  res.status(200).json(
    new ApiResponse(200, "Profile updated successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    })
  );
});

export const addAddress = apiHandler(async (req, res) => {
  const userId = req.user._id;
  const addressData = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.addresses.push(addressData);
  await user.save();

  res.status(201).json(
    new ApiResponse(201, "Address added successfully", user.addresses)
  );
});

export const updateAddress = apiHandler(async (req, res) => {
  const userId = req.user._id;
  const { id: addressId } = req.params;
  const updateData = req.body;

  const user = await User.findOneAndUpdate(
    { _id: userId, "addresses._id": addressId },
    { $set: { "addresses.$": { ...updateData, _id: addressId } } },
    { new: true }
  );

  if (!user) throw new ApiError(404, "Address not found");

  res.status(200).json(
    new ApiResponse(200, "Address updated successfully", user.addresses)
  );
});

export const deleteAddress = apiHandler(async (req, res) => {
  const userId = req.user._id;
  const { id: addressId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );

  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(
    new ApiResponse(200, "Address deleted successfully", user.addresses)
  );
});
