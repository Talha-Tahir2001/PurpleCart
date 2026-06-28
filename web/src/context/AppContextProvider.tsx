import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext, type AppContextType } from "./AppContext";

import type { Product } from "../types/Product";
import type { User } from "../types/User";
import { dummyProducts } from "../assets/assets";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL as string;

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currency = import.meta.env.VITE_CURRENCY as string;
  const [products, setProducts] = useState<Product[]>(
    dummyProducts as unknown as Product[],
  );
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  // const [products, setProducts] = useState<Product[]>([]);

  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");

      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch {
      setIsSeller(false);
    }
  };

  // Fetch user
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems ?? {});
      }
    } catch {
      setUser(null);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");

      if (data.success) {
        setProducts(
          data.products.length > 0
            ? data.products
            : (dummyProducts as unknown as Product[]),
        );
      } else {
        toast.error(data.message);
        setProducts(dummyProducts as unknown as Product[]);
      }
    } catch (error) {
      setProducts(dummyProducts as unknown as Product[]);

      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      }
    }
  };

  // Add to cart
  const addToCart = (itemId: string) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added To Cart");
  };

  // Cart count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  // Cart amount
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const item = products.find((p) => p._id === itemId);

      if (item) {
        totalAmount += item.offerPrice * cartItems[itemId];
      }
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  // Update quantity
  const updateCartItem = (itemId: string, quantity: number) => {
    const cartData = structuredClone(cartItems);

    cartData[itemId] = quantity;

    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  // Remove from cart
  const removeFromCart = (itemId: string) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId]--;

      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    setCartItems(cartData);
    toast.success("Removed From Cart");
  };

  useEffect(() => {
    // Run startup fetches inside an async function to avoid calling
    // state-updating functions synchronously within the effect body.
    (async () => {
      try {
        await Promise.allSettled([fetchUser(), fetchSeller(), fetchProducts()]);
      } catch {
        // ignore
      }
    })();
  }, []);

  // Sync cart with database
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", {
          cartItems,
        });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        }
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems, user]);

  const contextValue: AppContextType = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartAmount,
    getCartCount,
    fetchProducts,
    fetchUser,
    axios,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
