import { body } from "express-validator";

const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product Name is required")
    .isLength({ min: 3 })
    .withMessage(
      "Product Name must be at least 3 characters"
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage(
      "Description must be at least 10 characters"
    ),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage(
      "Price must be a positive number"
    ),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("subCategory")
    .trim()
    .notEmpty()
    .withMessage("Sub-category is required"),
];

export { createProductValidation };