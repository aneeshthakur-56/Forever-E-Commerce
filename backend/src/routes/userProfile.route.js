import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { 
  getUserProfile, 
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress
} from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", authUser, getUserProfile);
router.put("/profile", authUser, upload.single("image"), updateUserProfile);

router.post("/address", authUser, addAddress);
router.put("/address/:id", authUser, updateAddress);
router.delete("/address/:id", authUser, deleteAddress);

export { router as userProfileRouter };
