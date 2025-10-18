import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { ICartItem } from "../../types/cart";
import { BASE_URL } from "../../constants/baseurl";
import { useAuth } from "../Auth/AuthContext";


export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cartItems, setCartItem] = useState<ICartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { token } = useAuth();
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) setError("Failed To Fetch Cart");

        const cart = await response.json();

        setCartItem(cart.items);
        setTotalAmount(cart.totalAmount);
      } catch (err) {
        setError(err as string);
      }
    };

    fetchCart();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) setError("Failed To Orders");

      const orders = await response.json();

      setOrders(orders);
    } catch (err) {
      setError(err as string);
    }
  };

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

      if (!response.ok) setError("Failed To Add To Cart");

      const cart = await response.json();

      if (!cart) setError("Failed To Parse Cart Data");

      setCartItem(cart.items);
      setTotalAmount(cart.totalAmount);
    } catch (err) {
      setError(err as string);
      console.error(error);
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

      if (!response.ok) setError("Failed To Update Cart");

      const cart = await response.json();

      if (!cart) setError("Failed To Parse Cart Data");

      setCartItem(cart.items);

      setTotalAmount(cart.totalAmount);
    } catch (err) {
      setError(err as string);
      console.error(error);
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

      if (!response.ok) setError("Failed To Delete Cart");

      const cart = await response.json();

      if (!cart) setError("Failed To Parse Cart Data");

      setCartItem(cart.items);
      setTotalAmount(cart.totalAmount);
    } catch (err) {
      setError(err as string);
      console.error(error);
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

      if (!response.ok) setError("Failed To Clear Cart");

      const cart = await response.json();

      if (!cart) setError("Failed To Parse Cart Data");

      setCartItem([]);
      setTotalAmount(0);
    } catch (err) {
      setError(err as string);
      console.error(error);
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
