import { HOUR_NUMBERS } from '../lib/clockMath';
import styles from '../styles/clockMain.module.css';

type HourNumbersProps = {
  ariaHidden?: boolean;
};

/** Renders 12 hour labels positioned around the clock dial. */
export function HourNumbers({ ariaHidden }: HourNumbersProps) {
  return (
    <div
      className={styles.dialNumbers}
      aria-hidden={ariaHidden ? 'true' : undefined}
    >
      {HOUR_NUMBERS.map((label, idx) => {
        const numClass = styles[`num${idx + 1}`];
        return (
          <span
            key={`${label}-${idx}`}
            className={`${styles.num} ${numClass ?? ''}`}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
