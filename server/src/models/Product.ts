import { Schema, model, type Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string[];
  price: number;
  offerPrice: number;
  images: string[];
  category: string;
  quantity: number;
  inStock: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IProduct>("Product", productSchema);