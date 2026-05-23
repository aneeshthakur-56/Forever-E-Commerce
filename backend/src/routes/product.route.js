import { Router } from "express";
import {
  addProduct,
  getProduct,
  getProducts,
  removeProduct,
  searchProducts,
  addReview,
} from "../controllers/product.controller.js";
import { createProductValidation } from "../validators/product.validator.js";
import { validate } from "../middleware/validate.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { authAdmin, authUser } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/list-products", getProducts);
router.post("/search", searchProducts);
router.get("/detail-product/:productId", getProduct);
router.post("/add-review", authUser, addReview);

router.post(
  "/add-product",
  authAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  createProductValidation,
  validate,
  addProduct,
);
router.delete("/delete-product/:productId", authAdmin, removeProduct);

export { router as productRouter };
