import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./stores/CartContext";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;