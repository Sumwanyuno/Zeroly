import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"; // 1. Import dotenv

dotenv.config();

console.log("--- Checking Cloudinary Environment Variables ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret Loaded:", !!process.env.CLOUDINARY_API_SECRET);
console.log("-------------------------------------------");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
