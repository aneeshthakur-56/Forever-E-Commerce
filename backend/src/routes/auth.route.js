import { Router } from "express";
import {
  adminLogin,
  loginUser,
  logoutUser,
  registerUser,
  verifyAdmin,
  verifyUser,
} from "../controllers/auth.controller.js";
import {
  registerValidation,
  loginValidation,
} from "../validators/user.validation.js";
import { validate } from "../middleware/validate.middleware.js";
import { authAdmin, authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);
router.post("/admin", loginValidation, validate, adminLogin);

router.get("/verify", authAdmin, verifyAdmin);
router.get("/user/verify", authUser, verifyUser);

router.post("/logout", logoutUser);

export { router as authRouter };
