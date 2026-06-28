import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../configs/env.js";

interface SellerTokenPayload extends jwt.JwtPayload {
  email: string;
}

const authSeller = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    res.json({
      success: false,
      message: "Not Authorized",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      sellerToken,
      env.JWT_SECRET
    ) as SellerTokenPayload;

    if (decoded.email === env.SELLER_EMAIL) {
      next();
      return;
    }

    res.json({
      success: false,
      message: "Not Authorized",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export default authSeller;