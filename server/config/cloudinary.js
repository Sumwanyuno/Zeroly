// server/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"; // 1. Import dotenv

// 2. This line forces the .env file to be read right here
dotenv.config();

// --- Start of Diagnostic Log ---
console.log("--- Checking Cloudinary Environment Variables ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret Loaded:", !!process.env.CLOUDINARY_API_SECRET);
console.log("-------------------------------------------");
// --- End of Diagnostic Log ---

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
