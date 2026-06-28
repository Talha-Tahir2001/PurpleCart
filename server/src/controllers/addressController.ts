import type { Response } from "express";
import Address, { type IAddress } from "../models/Address.js";
import type { AuthenticatedRequest } from "../types/authenticatedRequest.js";

interface AddAddressRequestBody {
  address: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipcode: number;
    country: string;
    phone: string;
  };
}

// Add Address
// POST /api/address/add
export const addAddress = async (
  req: AuthenticatedRequest<AddAddressRequestBody>,
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

    const { address } = req.body;

    await Address.create({
      ...address,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
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

// Get Addresses
// GET /api/address/get
export const getAddress = async (
  req: AuthenticatedRequest<AddAddressRequestBody>,
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

    const addresses: IAddress[] = await Address.find({ userId });

    res.status(200).json({
      success: true,
      addresses,
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