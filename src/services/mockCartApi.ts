import { CartItem } from "../types/product";

export const addCartItemRequest = async (item: CartItem) => {
  await new Promise((resolve) => window.setTimeout(resolve, 450));

  if (Math.random() < 0.15) {
    throw new Error("Cart service is temporarily unavailable.");
  }

  return item;
};
