import { useCart } from "../stores/CartContext";
import styles from "./CartDrawer.module.scss";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const subtotal = cart.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0,
  );

  return (
    <>
      <button
        className={`${styles.overlay} ${open ? styles.open : ""}`}
        type="button"
        aria-label="Close cart"
        onClick={onClose}
      />
      <aside
        className={`${styles.drawer} ${open ? styles.open : ""}`}
        aria-hidden={!open}
        aria-label="Shopping cart"
      >
        <header className={styles.header}>
          <h2>Cart</h2>
          <button type="button" onClick={onClose} aria-label="Close cart">
            x
          </button>
        </header>

        <div className={styles.items}>
          {cart.length === 0 ? (
            <p className={styles.empty}>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <article className={styles.item} key={item.cartKey}>
                <img src={item.image} alt={item.title} />
                <div className={styles.itemBody}>
                  <h3>{item.title}</h3>
                  <p>
                    {item.colorName} / {item.size}
                  </p>
                  <strong>${item.salePrice.toFixed(2)}</strong>
                  <div className={styles.row}>
                    <div className={styles.quantity}>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.cartKey, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.cartKey, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles.remove}
                      type="button"
                      onClick={() => removeFromCart(item.cartKey)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <footer className={styles.summary}>
          <div>
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div>
            <span>Grand total</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </footer>
      </aside>
    </>
  );
};

export default CartDrawer;
