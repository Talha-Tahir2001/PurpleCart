export interface Product {
  _id: string;
  name: string;
  category: string;
  image: string[];
  price: number;
  offerPrice: number;
  quantity: number;
  inStock: boolean;
  description: string[];
}