import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const addressSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  street:    { type: String, required: true },
  city:      { type: String, required: true },
  state:     { type: String, required: true },
  zipCode:   { type: String, required: true },
  country:   { type: String, required: true },
  phone:     { type: String, required: true },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    cartData: {
      type: Object,
      default: {},
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.models.User || model("User", userSchema);
export default User;
