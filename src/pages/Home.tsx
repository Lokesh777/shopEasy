import { getProducts } from "../services/api";
import styles from "./Home.module.scss";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });

  // useEffect(() => {
  //   const controller = new AbortController();

  //   const loadProducts = async () => {
  //     setLoading(true);
  //     setError("");

  //     try {
  //       const productData = await getProducts();
  //       if (!controller.signal.aborted) setProducts(productData);
  //     } catch {
  //       if (!controller.signal.aborted) {
  //         setError("Products could not be loaded. Please try again.");
  //       }
  //     } finally {
  //       if (!controller.signal.aborted) setLoading(false);
  //     }
  //   };

  //   loadProducts();
  //   return () => controller.abort();
  // }, []);

  if (isLoading) {
    return <div className="pageStatus">Loading products...</div>;
  }
  
  if (isError) {
    return (
      <div className="pageStatus pageStatusError">
        Products could not be loaded.
      </div>
    );
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
