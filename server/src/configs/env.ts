import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

  JWT_EXPIRE: z.string().default("7d"),
  SELLER_EMAIL: z.string().min(1, "SELLER_EMAIL is required"),
  SELLER_PASSWORD: z.string().min(1, "SELLER_PASSWORD is required"),
  COOKIE_EXPIRE: z.coerce.number().default(7),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// IMPORTANT: process.env must already be loaded BEFORE this file runs
const parsedEnv = envSchema.safeParse(process.env);

// if (!parsedEnv.success) {
//   console.error("❌ Invalid environment variables:");
//   console.error(parsedEnv.error.format);
//   throw new Error("Invalid environment variables");
// }
if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");

  // ✅ correct way to inspect errors in Zod 4
  console.error(JSON.stringify(parsedEnv.error.flatten(), null, 2));

  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;