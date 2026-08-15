import { useState, type FC, type PropsWithChildren } from "react";
import { Context } from "./AuthContext";
import type { IProductProps } from "../../types/product";

const USERNAME_KEY = "username";
const TOKEN_KEY = "token";
const ADMIN_KEY = "isAdmin";
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

  const [isAdmin, setIsAdmin] = useState<boolean>(
    localStorage.getItem(ADMIN_KEY) === "true"
  );

  const isAuthenticated = !!token;

  const login = (username: string, token: string) => {
    setUsername(username);
    setToken(token);
    setIsAdmin(false);

    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(ADMIN_KEY);
  };

  const adminLogin = (username: string, token: string) => {
    setUsername(username);
    setToken(token);
    setIsAdmin(true);

    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, "true");
  };

  const logout = () => {
    setUsername(null);
    setToken(null);
    setIsAdmin(false);

    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  };

  return (
    <Context.Provider
      value={{
        username,
        token,
        productsInContext,
        isAuthenticated,
        isAdmin,
        login,
        adminLogin,
        logout,
        setProductsInContext,
      }}
    >
      {children}
    </Context.Provider>
  );
};
