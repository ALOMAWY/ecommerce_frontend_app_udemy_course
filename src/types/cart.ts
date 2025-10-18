import type { IProductProps } from "./product";

export interface ICartItem {
  _id: string;
  product: string | IProductProps;
  title: string;
  quantity: number;
  unitPrice: number;
  image: string;
}
