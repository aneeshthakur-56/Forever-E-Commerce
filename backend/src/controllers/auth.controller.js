import jwt from "jsonwebtoken";
import apiHandler from "../utils/apiHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const TOKEN_EXPIRY = "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// Evaluated at request time not module load time
const getCookieOptions = () => ({
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: COOKIE_MAX_AGE,
  path: "/",
});

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

// Login User
export const loginUser = apiHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid email or password");

  // Use model method — no bcrypt import needed
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new ApiError(401, "Invalid email or password");

  const token = generateToken({ _id: user._id, email: user.email });

  res.cookie("token", token, getCookieOptions());
  res.status(200).json(
    new ApiResponse(200, "Authentication Successful", {
      _id: user._id,
      name: user.name,
      email: user.email,
    }),
  );
});

// Register User
export const registerUser = apiHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password });

  const token = generateToken({ _id: user._id, email: user.email });

  res.cookie("token", token, getCookieOptions());
  res.status(201).json(
    new ApiResponse(201, "Registration Successful", {
      _id: user._id,
      name: user.name,
      email: user.email,
    }),
  );
});

// Admin Login
export const adminLogin = apiHandler(async (req, res) => {
  const { email, password } = req.body;
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new ApiError(401, "Invalid admin credentials");
  }

  const token = generateToken({ email, role: "admin" });

  res.cookie("adminToken", token, getCookieOptions());
  res.status(200).json(new ApiResponse(200, "Admin Login Successful"));
});

// Verify Admin
export const verifyAdmin = apiHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Admin  logged in."));
});
export const verifyUser = apiHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "User  logged in."));
});
// Logout (clears both cookies to handle either session type)
export const logoutUser = apiHandler(async (req, res) => {
  const cookieOpts = { httpOnly: true, secure: false, sameSite: "lax", path: "/" };
  res.clearCookie("token", cookieOpts);
  res.clearCookie("adminToken", cookieOpts);
  res.status(200).json(new ApiResponse(200, "Logged out successfully."));
});
