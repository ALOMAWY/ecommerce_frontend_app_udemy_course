export interface IOrderItem {
  productTitle: string;
  productImage: string;
  unitprice: number;
  quantity: number;
}

export interface IOrder {
  orderItems: IOrderItem[];
  total: number;
  address: string;
}
