import { RouterProvider } from "react-router-dom";
import { CartProvider } from "./stores/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/router";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;