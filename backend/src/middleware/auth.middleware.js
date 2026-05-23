import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const requireAuth = (requiredRole = null) => {
  return (req, res, next) => {
    try {
      const token =
        requiredRole === "admin"
          ? req.cookies.adminToken
          : req.cookies.token;

      if (!token) {
        throw new ApiError(401, "Unauthorized — No token found");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole === "admin" && decoded.role !== "admin") {
        throw new ApiError(403, "Forbidden — Admins only");
      }
      if (requiredRole === "admin") {
        req.admin = decoded;
      } else {
        req.user = decoded;
      }
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
      } else {
        next(new ApiError(401, "Unauthorized — Invalid or expired token"));
      }
    }
  };
};

const authAdmin = requireAuth("admin");
const authUser = requireAuth();

export { authAdmin, authUser };