import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

interface AddProductBody {
  productData: string;
}

interface ProductByIdBody {
  id: string;
}

interface ChangeStockBody {
  id: string;
  quantity: number;
}

// Add Product : /api/product/add
export const addProduct = async (
  req: Request<{}, {}, AddProductBody>,
  res: Response
): Promise<void> => {
  try {
    const productData = JSON.parse(req.body.productData);

    const images = req.files as Express.Multer.File[];

    const imageUrls = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });

        return result.secure_url;
      })
    );

    await Product.create({
      ...productData,
      images: imageUrls,
    });

    res.json({
      success: true,
      message: "Product Added",
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

// Get Products : /api/product/list
export const productList = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find({});

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

// Get Product By Id : /api/product/id
export const productById = async (
  req: Request<{}, {}, ProductByIdBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;

    const product = await Product.findById(id);

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

// Change Product Stock : /api/product/stock
export const changeStock = async (
  req: Request<{}, {}, ChangeStockBody>,
  res: Response
): Promise<void> => {
  try {
    const { id, quantity } = req.body;

    if (quantity < 0) {
      res.json({
        success: false,
        message: "Quantity cannot be negative",
      });
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        quantity,
        inStock: quantity > 0,
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Stock Updated",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};