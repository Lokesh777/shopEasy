import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductDetail from "../src/pages/ProductDetail";
import { CartProvider } from "../src/stores/CartContext";
import { Product } from "../src/types/product";

const product: Product = {
  id: 3,
  title: "Test Jacket",
  price: 120,
  description: "A reliable test product.",
  category: "clothing",
  image: "https://example.com/product.png",
  rating: {
    rate: 4,
    count: 10,
  },
};

vi.mock("../src/services/api", () => ({
  getProductById: vi.fn(async () => product),
}));

describe("product detail purchase state", () => {
  it("disables the add-to-cart CTA when the URL-selected variant is sold out", async () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={["/product/3?color=Black&size=L"]}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>,
    );

    expect(await screen.findByRole("heading", { name: "Test Jacket" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sold out$/i })).toBeDisabled();
  });
});
