import { useState, type FC, type PropsWithChildren } from "react";
import { Context } from "./AuthContext";
import type { IProductProps } from "../../types/product";

const USERNAME_KEY = "username";
const TOKEN_KEY = "token";
export const PRODUCTS_KEY = "products";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem(USERNAME_KEY)
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(TOKEN_KEY)
  );

  const [productsInContext, setProductsInContext] = useState<
    IProductProps[] | null
  >(null);

  const isAuthenticated = !!token;

  const login = (username: string, token: string) => {
    setUsername(username);
    setToken(token);

    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(TOKEN_KEY, token);
  };

  const logout = () => {
    setUsername(null);
    setToken(null);

    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <Context.Provider
      value={{
        username,
        token,
        productsInContext,
        isAuthenticated,
        login,
        logout,
        setProductsInContext,
      }}
    >
      {children}
    </Context.Provider>
  );
};
