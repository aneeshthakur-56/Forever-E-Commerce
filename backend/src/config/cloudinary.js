import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "forever",
  });
  await fs.unlink(file.path);
  return result.secure_url;
};

export { uploadToCloudinary };
