import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../configs/env.js";

interface SellerLoginBody {
  email: string;
  password: string;
}

interface SellerJwtPayload {
  email: string;
}

// Seller Login : /api/seller/login
export const sellerLogin = async (
  req: Request<{}, {}, SellerLoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (
      email === env.SELLER_EMAIL &&
      password === env.SELLER_PASSWORD
    ) {
      const token = jwt.sign(
        { email },
        env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: "Logged In!",
      });
      return;
    }

    res.json({
      success: false,
      message: "Invalid Credentials!",
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

// Check Seller Auth : /api/seller/is-auth
export const isSellerAuth = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

// Seller Logout : /api/seller/logout
export const sellerLogout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({
      success: true,
      message: "Admin Logged Out!",
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};