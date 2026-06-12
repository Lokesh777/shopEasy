import { Product, ProductVariant } from "../types/product";

const colors = [
  { color: "#111827", colorName: "Black" },
  { color: "#f8fafc", colorName: "White" },
  { color: "#2563eb", colorName: "Blue" },
  { color: "#b45309", colorName: "Tan" },
];

const sizes = ["S", "M", "L", "XL"];

export const getBrandName = (product: Product) => {
  const words = product.title.split(" ").filter(Boolean);
  return words.slice(0, 2).join(" ");
};

export const getPricing = (product: Product) => {
  const hasSale = product.id % 3 === 0;
  const originalPrice = hasSale ? Number((product.price * 1.2).toFixed(2)) : undefined;

  return {
    salePrice: product.price,
    originalPrice,
  };
};

export const getProductImages = (product: Product) => [
  product.image,
  product.image,
  product.image,
];

export const getProductVariants = (product: Product): ProductVariant[] => {
  return colors.flatMap((color, colorIndex) =>
    sizes.map((size, sizeIndex) => {
      const stock = (product.id + colorIndex * 3 + sizeIndex * 2) % 7;
      const normalizedStock = stock === 0 ? 0 : stock + 1;

      return {
        ...color,
        size,
        stock: normalizedStock,
        stockState:
          normalizedStock === 0
            ? "sold-out"
            : normalizedStock <= 3
              ? "low"
              : "available",
      };
    }),
  );
};

export const findVariant = (
  variants: ProductVariant[],
  colorName: string | null,
  size: string | null,
) => {
  const exact = variants.find(
    (variant) => variant.colorName === colorName && variant.size === size,
  );

  if (exact) return exact;

  return variants.find((variant) => variant.stockState !== "sold-out") ?? variants[0];
};

export const getDefaultVariant = (product: Product) =>
  findVariant(getProductVariants(product), null, null);
