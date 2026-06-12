import { useEffect, useState } from "react";
import { lazy, Suspense } from "react";

const ProductCard = lazy(() => import("../components/ProductCard"));
import { getProducts } from "../services/api";
import { Product } from "../types/product";
import styles from "./Home.module.scss";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const productData = await getProducts();
        if (!controller.signal.aborted) setProducts(productData);
      } catch {
        if (!controller.signal.aborted) {
          setError("Products could not be loaded. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProducts();
    return () => controller.abort();
  }, []);

  if (loading) {
    return <div className="pageStatus">Loading products...</div>;
  }

  if (error) {
    return <div className="pageStatus pageStatusError">{error}</div>;
  }

  return (
    <section className={styles.page} data-testid="product-listing">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Mini commerce</p>
        <h1>Everyday picks from Easy Store</h1>
        <p>
          Browse the catalogue, choose a variant, and keep your cart through a
          refresh.
        </p>
      </header>

      <section className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </section>
  );
};

export default Home;
