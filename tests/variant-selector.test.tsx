import { fireEvent, render, screen } from "@testing-library/react";
import QuantityPicker from "../src/components/QuantityPicker";
import VariantSelector from "../src/components/VariantSelector";
import { ProductVariant } from "../src/types/product";

const variants: ProductVariant[] = [
  {
    color: "#111827",
    colorName: "Black",
    size: "S",
    stock: 4,
    stockState: "available",
  },
  {
    color: "#111827",
    colorName: "Black",
    size: "M",
    stock: 2,
    stockState: "low",
  },
  {
    color: "#111827",
    colorName: "Black",
    size: "L",
    stock: 0,
    stockState: "sold-out",
  },
];

describe("variant selector", () => {
  it("disables sold-out sizes", () => {
    render(
      <VariantSelector
        variants={variants}
        selectedVariant={variants[0]}
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: /l sold out/i })).toBeDisabled();
  });

  it("shows low-stock messaging", () => {
    render(
      <VariantSelector
        variants={variants}
        selectedVariant={variants[0]}
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByText("Low stock: 2")).toBeInTheDocument();
  });
});

describe("quantity picker", () => {
  it("does not increase beyond the stock cap", () => {
    const onChange = vi.fn();

    render(<QuantityPicker value={2} max={2} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "+" }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
