import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { useUnwrappedDisplayAngle } from './hooks/useUnwrappedDisplayAngle';
import styles from '../styles/clockMain.module.css';
import stylesMinus from '../styles/clockMinus.module.css';
const DIAL_NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

type ClockMinusProps = {
  offsetHours?: number;
};

function getHourHandAngle(date: Date) {
  const h12 = date.getHours() % 12; // 0..11
  return h12 * 30; // 360 / 12 = 30 deg per hour
}

function snapAngleToHour(deg: number) {
  const snapped = Math.round(deg / 30) * 30;
  return ((snapped % 360) + 360) % 360;
}

export function ClockMinus({ offsetHours = 0 }: ClockMinusProps) {
  const [baseAngleDeg, setBaseAngleDeg] = useState(() =>
    getHourHandAngle(new Date()),
  );

  useEffect(() => {
    let timeoutId: number | undefined;

    const tick = () => {
      const now = new Date();
      setBaseAngleDeg(getHourHandAngle(now));

      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      const delayMs = Math.max(0, nextHour.getTime() - now.getTime());

      timeoutId = window.setTimeout(tick, delayMs);
    };

    tick();
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  const angleDeg = useMemo(() => {
    const raw = baseAngleDeg + (offsetHours - 1) * 30;
    return snapAngleToHour(raw);
  }, [baseAngleDeg, offsetHours]);

  const displayAngleDeg = useUnwrappedDisplayAngle(angleDeg);

  const cssVars = {
    '--angle-deg': `${displayAngleDeg}deg`,
    '--size': '150px',
    '--bg': 'rgb(0, 170, 80)',
  } as CSSProperties;

  return (
    <section
      className={`${styles.clockMain} ${stylesMinus.clockMinus}`}
      style={cssVars}
    >
      <div className={styles.dialNumbers}>
        {DIAL_NUMBERS.map((label, idx) => {
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
      <div className={styles.hand} style={{ width: '0.4rem' }} />
      <div className={styles.centerCap} />
      <p className={stylesMinus.title}>-1 Hour</p>
    </section>
  );
}
