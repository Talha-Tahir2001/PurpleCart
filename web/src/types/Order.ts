import type { Product } from "./Product";

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  address: Address;
  amount: number;
  paymentType: string;
  createdAt: string;
  isPaid: boolean;
}