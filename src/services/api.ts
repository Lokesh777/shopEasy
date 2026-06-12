import { Product } from "../types/product";

const BASE_URL = "https://fakestoreapi.com";

type FakeStoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
};

const toAppProduct = (product: FakeStoreProduct): Product => ({
  id: product.id,
  title: product.title,
  category: product.category,
  description: product.description,
  image: product.image,
  price: product.price,
  rating: {
    rate: product.rating?.rate ?? 0,
    count: product.rating?.count ?? 0,
  },
});

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Fake Store API request failed: ${response.status}`);
  }

  return response.json();
};

export const getProducts = async () => {
  const data = await request<FakeStoreProduct[]>("/products");
  return data.map(toAppProduct);
};

export const getProductById = async (id: string) => {
  const data = await request<FakeStoreProduct>(`/products/${id}`);
  return toAppProduct(data);
};
