export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export type StockState = "available" | "low" | "sold-out";

export interface ProductVariant {
  color: string;
  colorName: string;
  size: string;
  stock: number;
  stockState: StockState;
}

export interface CartItem {
  cartKey: string;
  productId: number;
  title: string;
  image: string;
  unitPrice: number;
  salePrice: number;
  originalPrice?: number;
  color: string;
  colorName: string;
  size: string;
  quantity: number;
  maxQuantity: number;
}
