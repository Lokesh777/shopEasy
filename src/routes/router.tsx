import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const Home = lazy(() => import("../pages/Home"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
import { getProductById } from "../services/api";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
    loader: async ({ params }) => {
      return getProductById(params.id!);
    },
  },
]);