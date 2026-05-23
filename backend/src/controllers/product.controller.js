import { uploadToCloudinary } from "../config/cloudinary.js";
import apiHandler from "../utils/apiHandler.js";
import Product from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

export const addProduct = apiHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    subCategory,
    sizes,
    bestSeller,
  } = req.body;

  const { image1, image2, image3, image4 } = req.files;

  const imageUrls = await Promise.all(
    [image1, image2, image3, image4]
      .filter(Boolean)
      .map((file) => uploadToCloudinary(file[0]))
  );

  if (imageUrls.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  const product = await Product.create({
    name,
    description,
    category,
    subCategory,
    price:      Number(price),
    bestSeller: bestSeller === "true",
    sizes:      typeof sizes === "string" ? JSON.parse(sizes) : sizes,
    image:      imageUrls,
  });

  res.status(201).json(
    new ApiResponse(201, "Product Created Successfully", { _id: product._id })
  );
});

export const getProducts = apiHandler(async (req, res) => {
  const products = await Product.find();

  // find() returns [] not null — check length
  if (products.length === 0) {
    throw new ApiError(404, "No Products Found");
  }

  res.status(200).json(
    new ApiResponse(200, "Products Fetched Successfully", products)
  );
});

export const removeProduct = apiHandler(async (req, res) => {
  const { productId } = req.params;

  // Single DB call — findByIdAndDelete returns null if not found
  const product = await Product.findByIdAndDelete(productId);
  if (!product) throw new ApiError(404, "Product Not Found");

  res.status(200).json(
    new ApiResponse(200, "Product Deleted Successfully")
  );
});

export const getProduct = apiHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product Not Found");

  res.status(200).json(
    new ApiResponse(200, "Product Fetched Successfully", product)
  );
});

export const searchProducts = apiHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    search = "", 
    category = [], 
    subCategory = [], 
    sortType = "relevant",
    isBestSeller = false
  } = req.body;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (category && category.length > 0) {
    query.category = { $in: category };
  }
  if (subCategory && subCategory.length > 0) {
    query.subCategory = { $in: subCategory };
  }
  if (isBestSeller) {
    query.bestSeller = true;
  }

  let sort = {};
  if (sortType === "low-high") {
    sort.price = 1;
  } else if (sortType === "high-low") {
    sort.price = -1;
  } else {
    sort._id = -1; 
  }

  const [products, totalProducts] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limitNum),
    Product.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalProducts / limitNum) || 1;

  res.status(200).json(
    new ApiResponse(200, "Products Fetched Successfully", {
      products,
      totalProducts,
      totalPages,
      currentPage: pageNum
    })
  );
});

export const addReview = apiHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user._id;

  if (!productId || !rating) {
    throw new ApiError(400, "Product ID and rating are required");
  }

  const hasBought = await Order.findOne({
    userId,
    "items.productId": productId,
    status: { $ne: "Cancelled" } 
  });

  if (!hasBought) {
    throw new ApiError(403, "You can only review products you have purchased.");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const alreadyReviewed = product.reviews.some(
    (review) => review.userId.toString() === userId.toString()
  );

  if (alreadyReviewed) {
    throw new ApiError(400, "You have already reviewed this product.");
  }

  const user = await User.findById(userId);

  const review = {
    userId,
    name: user.name,
    rating: Number(rating),
    comment: comment || "",
  };

  product.reviews.push(review);
  await product.save();

  res.status(201).json(
    new ApiResponse(201, "Review added successfully", review)
  );
});