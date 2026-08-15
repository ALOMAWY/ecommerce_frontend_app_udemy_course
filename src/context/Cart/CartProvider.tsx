import { useEffect, useState, useCallback, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { ICartItem } from "../../types/cart";
import { BASE_URL } from "../../constants/baseurl";
import { useAuth } from "../Auth/AuthContext";
import { useLang } from "../../i18n/LanguageContext";
import { toast } from "sonner";

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cartItems, setCartItem] = useState<ICartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { token } = useAuth();
  const { t } = useLang();
  const [orders, setOrders] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch cart");
      const cart = await response.json();
      setCartItem(cart.items || []);
      setTotalAmount(cart.totalAmount || 0);
    } catch (err) {
      console.error("fetchCart error:", err);
    }
  }, [token]);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/cart/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      console.error("fetchOrders error:", err);
      toast.error(t("cart.loadOrdersError"));
    }
  }, [token, t]);

  useEffect(() => {
    fetchCart();
    fetchOrders();
  }, [fetchCart, fetchOrders]);

  const addItemToCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      const cart = await response.json();
      if (!cart) throw new Error("Invalid cart data");
      setCartItem(cart.items);
      setTotalAmount(cart.totalAmount);
    } catch (err) {
      console.error("addItemToCart error:", err);
      toast.error(t("cart.addError"));
    }
  };

  const updateItemInCart = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error("Failed to update cart");
      const cart = await response.json();
      if (!cart) throw new Error("Invalid cart data");
      setCartItem(cart.items);
      setTotalAmount(cart.totalAmount);
    } catch (err) {
      console.error("updateItemInCart error:", err);
      toast.error(t("cart.updateError"));
    }
  };

  const removeItemInCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to remove from cart");
      const cart = await response.json();
      if (!cart) throw new Error("Invalid cart data");
      setCartItem(cart.items);
      setTotalAmount(cart.totalAmount);
    } catch (err) {
      console.error("removeItemInCart error:", err);
      toast.error(t("cart.removeError"));
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to clear cart");
      await response.json();
      setCartItem([]);
      setTotalAmount(0);
      toast.success(t("cart.clearSuccess"));
    } catch (err) {
      console.error("clearCart error:", err);
      toast.error(t("cart.clearError"));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orders,
        totalAmount,
        addItemToCart,
        updateItemInCart,
        removeItemInCart,
        clearCart,
        fetchOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
