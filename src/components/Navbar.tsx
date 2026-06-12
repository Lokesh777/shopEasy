import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../stores/CartContext";
const CartDrawer = lazy(() => import("./CartDrawer"));
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav className={styles.navbar}>
        <Link className={styles.logo} to="/">
          ShopEasy
        </Link>

        <button
          className={styles.cartButton}
          type="button"
          aria-label="Open cart"
          onClick={() => setCartOpen(true)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          {totalItems > 0 && <strong>{totalItems}</strong>}
        </button>
      </nav>
      {cartOpen && (
      <Suspense fallback={<div>Loading...</div>}>
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </Suspense>
      )}
    </>
  );
};

export default Navbar;
