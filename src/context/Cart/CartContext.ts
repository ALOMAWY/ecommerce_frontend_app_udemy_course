import { createContext, useContext } from "react";

import type { ICartItem } from "../../types/cart";
import type { IOrder } from "../../types/order";

export interface ICartContext {
  cartItems: ICartItem[];
  orders: IOrder[];
  totalAmount: number;
  addItemToCart: (productId: string) => void;
  updateItemInCart: (productId: string, quantity: number) => void;
  removeItemInCart: (productId: string) => void;
  clearCart: () => void;
  fetchOrders: () => void;
}

export const CartContext = createContext<ICartContext>({
  cartItems: [],
  orders: [],
  totalAmount: 0,
  addItemToCart: () => {},
  updateItemInCart: () => {},
  removeItemInCart: () => {},
  clearCart: () => {},
  fetchOrders: () => {},
});

export const useCart = () => useContext(CartContext);
