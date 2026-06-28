import type { Response } from "express";
import User from "../models/User.js";
import type { AuthenticatedRequest } from "../types/authenticatedRequest.js";

interface UpdateCartRequestBody {
  cartItems: Record<string, number>;
}

// Update User CartData : /api/cart/update
export const updateCart = async (
  req: AuthenticatedRequest<UpdateCartRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { cartItems } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    await User.findByIdAndUpdate(userId, { cartItems });

    res.json({
      success: true,
      message: "Cart Updated",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    console.error(message);

    res.status(500).json({
      success: false,
      message,
    });
  }
};