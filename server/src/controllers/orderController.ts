import type { Response } from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import type { AuthenticatedRequest } from "../types/authenticatedRequest.js";

interface OrderItem {
  product: string;
  quantity: number;
}

interface PlaceOrderRequestBody {
  address: string;
  items: OrderItem[];
}

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (
  req: AuthenticatedRequest<PlaceOrderRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { address, items } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!address || items.length === 0) {
      res.json({
        success: false,
        message: "Invalid data",
      });
      return;
    }

    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) continue;

      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02);

    const formattedItems = items.map(item => ({
      product: item.product,
      quantity: item.quantity,
    }));

    await Order.create({
      userId,
      items: formattedItems,
      amount,
      address,
      paymentType: "COD",
      isPaid: false,
    });

    await User.findByIdAndUpdate(userId, {
      cartItems: {},
    });

    res.json({
      success: true,
      message: "Order placed successfully!",
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

// Get Orders by userId : /api/order/user
export const getUserOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const orders = await Order.find({ userId })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
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

// Get all orders : /api/order/seller
export const getAllOrders = async (
  // req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({})
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
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