import React, { createContext, useContext } from "react";
import type { NavigateFunction } from "react-router-dom";
import type { AxiosInstance } from "axios";
import type { Product } from "../types/Product";
import type { User } from "../types/User";

// export interface Product {
//   _id: string;
//   offerPrice: number;
//   [key: string]: unknown;
// }

// export interface User {
//   cartItems?: Record<string, number>;
//   [key: string]: unknown;
// }

export interface AppContextType {
  navigate: NavigateFunction;

  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  isSeller: boolean;
  setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;

  showUserLogin: boolean;
  setShowUserLogin: React.Dispatch<React.SetStateAction<boolean>>;

  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;

  cartItems: Record<string, number>;
  setCartItems: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;

  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  currency: string;

  addToCart: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;

  getCartCount: () => number;
  getCartAmount: () => number;

  fetchProducts: () => Promise<void>;
  fetchUser: () => Promise<void>;

  axios: AxiosInstance;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
};