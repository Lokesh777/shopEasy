import { CartItem } from "../types/product";

export const addCartItemRequest = async (item: CartItem) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // simulate success
        resolve(item);
      } catch (e) {
        reject(new Error("Cart API failed"));
      }
    }, 200);
  });
};