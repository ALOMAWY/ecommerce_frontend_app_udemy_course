import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { IProductProps } from "../../types/product";

interface IAuthContext {
  username: string | null;
  token: string | null;
  productsInContext: IProductProps[] | null;
  login: (username: string, token: string) => void;
  setProductsInContext: Dispatch<SetStateAction<IProductProps[] | null>>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const Context = createContext<IAuthContext>({
  username: null,
  token: null,
  productsInContext: null,
  login: () => {},
  setProductsInContext: () => {},
  isAuthenticated: false,
  logout: () => {},
});

export const useAuth = () => useContext(Context);
