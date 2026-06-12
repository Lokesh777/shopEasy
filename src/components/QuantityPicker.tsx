import styles from "./QuantityPicker.module.scss";

interface QuantityPickerProps {
  value: number;
  min?: number;
  max: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}

const QuantityPicker = ({
  value,
  min = 1,
  max,
  onChange,
  disabled = false,
}: QuantityPickerProps) => {
  const decrease = () => onChange(Math.max(value - 1, min));
  const increase = () => onChange(Math.min(value + 1, max));

  return (
    <div className={styles.picker} aria-label="Quantity picker">
      <button type="button" onClick={decrease} disabled={disabled || value <= min}>
        -
      </button>
      <span>{value}</span>
      <button type="button" onClick={increase} disabled={disabled || value >= max}>
        +
      </button>
    </div>
  );
};

export default QuantityPicker;
