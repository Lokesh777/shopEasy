import { ProductVariant } from "../types/product";
import styles from "./VariantSelector.module.scss";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelect: (variant: ProductVariant) => void;
}

const getStatusLabel = (variant: ProductVariant) => {
  if (variant.stockState === "sold-out") return "Sold out";
  if (variant.stockState === "low") return `Low stock: ${variant.stock}`;
  return "Available";
};

const getSizeStatusClass = (variant: ProductVariant) => {
  if (variant.stockState === "low") return styles.lowStock;
  if (variant.stockState === "sold-out") return styles.soldOut;
  return "";
};

const VariantSelector = ({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) => {
  const colorOptions = variants.filter(
    (variant, index, allVariants) =>
      allVariants.findIndex((item) => item.colorName === variant.colorName) ===
      index,
  );

  const sizeOptions = variants.filter(
    (variant) => variant.colorName === selectedVariant.colorName,
  );

  return (
    <div className={styles.selector}>
      <fieldset>
        <legend>Colour</legend>
        <div className={styles.swatches}>
          {colorOptions.map((variant) => {
            const colorVariant =
              variants.find(
                (item) =>
                  item.colorName === variant.colorName &&
                  item.size === selectedVariant.size,
              ) ?? variant;

            return (
              <button
                key={variant.colorName}
                className={`${styles.swatch} ${
                  selectedVariant.colorName === variant.colorName
                    ? styles.selected
                    : ""
                }`}
                type="button"
                style={{ backgroundColor: variant.color }}
                aria-label={variant.colorName}
                onClick={() => onSelect(colorVariant)}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend>Size</legend>
        <div className={styles.sizes}>
          {sizeOptions.map((variant) => (
            <button
              key={variant.size}
              className={`${styles.size} ${
                selectedVariant.size === variant.size ? styles.selected : ""
              } ${getSizeStatusClass(variant)}`}
              type="button"
              onClick={() => onSelect(variant)}
              disabled={variant.stockState === "sold-out"}
            >
              <span>{variant.size}</span>
              <small>{getStatusLabel(variant)}</small>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default VariantSelector;
