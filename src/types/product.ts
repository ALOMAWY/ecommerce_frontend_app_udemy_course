export interface IProductProps {
  _id: string;
  title: string;
  image: string;
  images: string[];
  description: string;
  category?: string;
  price: number;
  stock: number;
  createdAt?: string;
}
