import { type CSSProperties } from 'react';
import { useClockHandAngle } from './hooks/useClockHandAngle';
import { HourNumbers } from './HourNumbers';
import styles from '../styles/clockMain.module.css';
import stylesPlus from '../styles/clockPlus.module.css';
import stylesMinus from '../styles/clockMinus.module.css';

type SmallClockVariant = 'plus' | 'minus';

type SmallClockProps = {
  offsetHours?: number;
  variant: SmallClockVariant;
};

const VARIANT_CONFIG = {
  plus: {
    hourDelta: 1,
    title: '+1 Hour',
    bg: 'rgb(255, 145, 0)',
    clockClass: stylesPlus.clockPlus,
    titleClass: stylesPlus.title,
  },
  minus: {
    hourDelta: -1,
    title: '-1 Hour',
    bg: 'rgb(0, 170, 80)',
    clockClass: stylesMinus.clockMinus,
    titleClass: stylesMinus.title,
  },
} as const;

/** Read-only preview clock showing main time shifted by ±1 hour. */
export function SmallClock({ offsetHours = 0, variant }: SmallClockProps) {
  const config = VARIANT_CONFIG[variant];
  const displayAngleDeg = useClockHandAngle(offsetHours, config.hourDelta);

  const cssVars = {
    '--angle-deg': `${displayAngleDeg}deg`,
    '--size': '150px',
    '--bg': config.bg,
  } as CSSProperties;

  return (
    <section
      className={`${styles.clockMain} ${config.clockClass}`}
      style={cssVars}
    >
      <HourNumbers />
      <div className={styles.hand} style={{ width: '0.4rem' }} />
      <div className={styles.centerCap} />
      <p className={config.titleClass}>{config.title}</p>
    </section>
  );
}
