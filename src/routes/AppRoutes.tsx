// AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
const Home = lazy(() => import("../pages/Home"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));

export default function AppRoutes() {
  return (
    <main>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </Suspense>
    </main>
  );
}