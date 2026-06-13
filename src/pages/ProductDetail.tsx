import { useEffect, useState } from "react";
import styles from "./ProductDetail.module.scss";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  findVariant,
  getBrandName,
  getPricing,
  getProductImages,
  getProductVariants,
} from "../data/variants";
import { getProductById } from "../services/api";
import { getCartKey, useCart } from "../stores/CartContext";

import { useQuery } from "@tanstack/react-query";
import QuantityPicker from "../components/QuantityPicker";
import VariantSelector from "../components/VariantSelector";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  // const [product, setProduct] = useState<Product | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [cartError, setCartError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

const {
  data: product,
  isLoading,
  isError,
} = useQuery({
  queryKey: ["product", id],
  queryFn: () => getProductById(id!),
  enabled: !!id,
  staleTime: 1000 * 60 * 5,
});

  // useEffect(() => {
  //   let ignore = false;

  //   const loadProduct = async () => {
  //     if (!id) return;
  //     setLoading(true);
  //     setError("");

  //     try {
  //       const productData = await getProductById(id);
  //       if (!ignore) setProduct(productData);
  //     } catch {
  //       if (!ignore) setError("This product could not be loaded.");
  //     } finally {
  //       if (!ignore) setLoading(false);
  //     }
  //   };

  //   loadProduct();
  //   return () => {
  //     ignore = true;
  //   };
  // }, [id]);

  useEffect(() => {
    if (!product) return;

    const variants = getProductVariants(product);
    const selectedVariant = findVariant(
      variants,
      searchParams.get("color"),
      searchParams.get("size"),
    );

    if (
      searchParams.get("color") !== selectedVariant.colorName ||
      searchParams.get("size") !== selectedVariant.size
    ) {
      setSearchParams(
        { color: selectedVariant.colorName, size: selectedVariant.size },
        { replace: true },
      );
    }
  }, [product, searchParams, setSearchParams]);

  if (isLoading) {
    return <div className="pageStatus">Loading product...</div>;
  }

  if (isError || !product) {
    return (
      <div className="pageStatus pageStatusError">
        Product could not be loaded.
      </div>
    );
  }

  const variants = getProductVariants(product);
  const selectedVariant = findVariant(
    variants,
    searchParams.get("color"),
    searchParams.get("size"),
  );
  const images = getProductImages(product);
  const pricing = getPricing(product);
  const isSoldOut = selectedVariant.stockState === "sold-out";
  const cartItem = cart.find(
    (item) => item.cartKey === getCartKey(product.id, selectedVariant),
  );

  const handleVariantSelect = (variant: typeof selectedVariant) => {
    setSearchParams({ color: variant.colorName, size: variant.size });
    setQuantity(1);
    setCartError("");
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setCartError("");

    try {
      await addToCart(product, selectedVariant, quantity);
    } catch {
      setCartError("Could not add this item. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };
  return (
    <section className={styles.page}>
      <Link className={styles.backLink} to="/">
        Back to products
      </Link>

      <div className={styles.layout}>
        <section className={styles.gallery} aria-label="Product images">
          <div className={styles.primaryImage}>
           <img
            src={images[activeImage]}
            alt={product.title}
            width={400}
            height={550}
            loading="eager"
            decoding="async"
            fetchpriority="high"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          </div>
          <div className={styles.thumbnails}>
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={activeImage === index ? styles.activeThumb : ""}
                type="button"
                onClick={() => setActiveImage(index)}
              >
                <img src={image} alt={`${product.title} view ${index + 1}`}  loading="eager"  decoding="async" fetchpriority="low" />
              </button>
            ))}
          </div>
        </section>

        <section className={styles.info}>
          <p className={styles.brand}>{getBrandName(product)}</p>
          <h1>{product.title}</h1>

          <div className={styles.price}>
            <span>${pricing.salePrice.toFixed(2)}</span>
            {pricing.originalPrice && (
              <del>${pricing.originalPrice.toFixed(2)}</del>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>
            <VariantSelector
              variants={variants}
              selectedVariant={selectedVariant}
              onSelect={handleVariantSelect}
            />

          {cartItem ? (
            <div className={styles.cartControls}>
              <div>
                <strong>In cart</strong>
                <span>Update quantity for this colour and size.</span>
              </div>
             <QuantityPicker
                  value={quantity}
                  max={Math.max(selectedVariant.stock, 1)}
                  onChange={setQuantity}
                  disabled={isSoldOut}
                />
              <button
                className={styles.removeButton}
                type="button"
                onClick={() => removeFromCart(cartItem.cartKey)}
              >
                Remove
              </button>
            </div>
          ) : (
            <div className={styles.purchase}>
              <QuantityPicker
                  value={quantity}
                  max={Math.max(selectedVariant.stock, 1)}
                  onChange={setQuantity}
                  disabled={isSoldOut}
                />
              <button
                className={styles.addButton}
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut || addingToCart}
              >
                {isSoldOut
                  ? "Sold out"
                  : addingToCart
                    ? "Adding..."
                    : "Add to Cart"}
              </button>
            </div>
          )}
          {cartError && <p className={styles.cartError}>{cartError}</p>}
        </section>
      </div>
    </section>
  );
};

export default ProductDetail;
