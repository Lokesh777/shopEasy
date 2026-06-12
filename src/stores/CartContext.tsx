import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CartItem, Product, ProductVariant } from "../types/product";
import { getPricing } from "../data/variants";
import { addCartItemRequest } from "../services/mockCartApi";

const CART_STORAGE_KEY = "shopeasy.cart.v2";

interface CartContextValue {
  cart: CartItem[];
  addToCart: (
    product: Product,
    variant: ProductVariant,
    quantity?: number,
  ) => Promise<void>;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const readCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const getCartKey = (productId: number, variant: ProductVariant) =>
  `${productId}-${variant.colorName}-${variant.size}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(readCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (
    product: Product,
    variant: ProductVariant,
    quantity = 1,
  ) => {
    if (variant.stockState === "sold-out") return;

    const { salePrice, originalPrice } = getPricing(product);
    const cartKey = getCartKey(product.id, variant);
    const nextItem: CartItem = {
      cartKey,
      productId: product.id,
      title: product.title,
      image: product.image,
      unitPrice: salePrice,
      salePrice,
      originalPrice,
      color: variant.color,
      colorName: variant.colorName,
      size: variant.size,
      quantity: Math.min(quantity, variant.stock),
      maxQuantity: variant.stock,
    };

    await addCartItemRequest(nextItem);

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.cartKey === cartKey);

      if (existingItem) {
        return currentCart.map((item) =>
          item.cartKey === cartKey
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, item.maxQuantity),
              }
            : item,
        );
      }

      return [...currentCart, nextItem];
    });
  };

  const removeFromCart = (cartKey: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.cartKey !== cartKey),
    );
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.cartKey === cartKey
          ? {
              ...item,
              quantity: Math.min(Math.max(quantity, 1), item.maxQuantity),
            }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
