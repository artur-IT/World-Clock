import { HOUR_NUMBERS } from '../lib/clockMath';
import styles from '../styles/clockMain.module.css';

type HourNumbersProps = {
  ariaHidden?: boolean;
};

const HOUR_NUM_CLASSES = [
  styles.num1,
  styles.num2,
  styles.num3,
  styles.num4,
  styles.num5,
  styles.num6,
  styles.num7,
  styles.num8,
  styles.num9,
  styles.num10,
  styles.num11,
  styles.num12,
] as const;

/** Renders 12 hour labels positioned around the clock dial. */
export function HourNumbers({ ariaHidden }: HourNumbersProps) {
  return (
    <div
      className={styles.dialNumbers}
      aria-hidden={ariaHidden ? 'true' : undefined}
    >
      {HOUR_NUMBERS.map((label, idx) => (
        <span
          key={`${label}-${idx}`}
          className={`${styles.num} ${HOUR_NUM_CLASSES[idx]}`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
