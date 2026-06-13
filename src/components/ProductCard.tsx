import { Link } from "react-router-dom";
import { useState } from "react";
import { getDefaultVariant } from "../data/variants";
import QuantityPicker from "./QuantityPicker";
import { getCartKey, useCart } from "../stores/CartContext";
import { Product } from "../types/product";
import styles from "./ProductCard.module.scss";
import { QueryClient } from "@tanstack/react-query";
import { getProductById } from "../services/api";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, cart, updateQuantity } = useCart();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const defaultVariant = getDefaultVariant(product);
  const queryClient = new QueryClient();
  const cartItem = cart.find(
    (item) => item.cartKey === getCartKey(product.id, defaultVariant),
  );

  const handleQuickAdd = async () => {
    setAdding(true);
    setError("");

    try {
      await addToCart(product, defaultVariant);
    } catch {
      setError("Could not add item. Try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className={styles.card} onMouseEnter={() => {
        queryClient.prefetchQuery({
          queryKey: ["product", product.id],
          queryFn: () => getProductById(product.id.toString()),
        });
      }}>
      <Link className={styles.mediaLink} to={`/product/${product.id}`}>
        <img src={product.image} alt={product.title} loading="lazy" />
      </Link>

      <div className={styles.content}>
        <Link className={styles.title} to={`/product/${product.id}`}>
          {product.title}
        </Link>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
      </div>

      {cartItem ? (
        <div className={styles.inCart}>
          <span>In cart</span>
          <QuantityPicker
            value={cartItem.quantity}
            max={cartItem.maxQuantity}
            onChange={(nextQuantity) =>
              updateQuantity(cartItem.cartKey, nextQuantity)
            }
          />
        </div>
      ) : (
        <button
          className={styles.quickAdd}
          type="button"
          onClick={handleQuickAdd}
          disabled={defaultVariant.stockState === "sold-out" || adding}
        >
          {adding ? "Adding..." : "Quick Add"}
        </button>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </article>
  );
};

export default ProductCard;
