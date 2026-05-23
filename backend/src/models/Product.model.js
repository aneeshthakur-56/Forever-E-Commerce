import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  userId:  { type: String, required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  date:    { type: Date, default: Date.now },
});

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: [String],   
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  sizes: {
    type: [String],   
    required: true,
  },
  bestSeller: {
    type: Boolean,
    default: false,   
  },
  date: {
    type: Date,
    default: Date.now, 
  },
  reviews: [reviewSchema],
});

const Product = model("Product", productSchema);

export default Product;