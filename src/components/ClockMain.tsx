import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import styles from '../styles/clockMain.module.css';
import { useUnwrappedDisplayAngle } from './hooks/useUnwrappedDisplayAngle';
import { resolveHourOffset } from '../lib/resolveHourOffset';

const HOUR_NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

const normalizeAngleDeg = (deg: number) => ((deg % 360) + 360) % 360; // always 0..359

const getHourHandAngle = (date: Date) => (date.getHours() % 12) * 30; // 30deg per hour

const snapAngleToHour = (deg: number) =>
  normalizeAngleDeg(Math.round(deg / 30) * 30); // step of 30deg (12h dial)

function getAngleDegFromPointer(
  el: HTMLDivElement,
  clientX: number,
  clientY: number,
) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = clientX - cx;
  const dy = clientY - cy;

  // 0deg at 12 o'clock, increasing clockwise.
  const rawDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  return normalizeAngleDeg(rawDeg + 90);
}

type ClockMainProps = {
  offsetHours?: number;
  onOffsetHoursChange?: (offsetHours: number) => void;
};

export function ClockMain({
  offsetHours = 0,
  onOffsetHoursChange,
}: ClockMainProps) {
  // `offsetHours` comes from the parent so other clocks can update live.
  const [baseAngleDeg, setBaseAngleDeg] = useState(() =>
    getHourHandAngle(new Date()),
  );
  const hourHandRef = useRef<HTMLDivElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const angleDeg = useMemo(() => {
    const raw = baseAngleDeg + offsetHours * 30;
    return normalizeAngleDeg(raw);
  }, [baseAngleDeg, offsetHours]);

  const displayAngleDeg = useUnwrappedDisplayAngle(angleDeg);

  const getAngleFromPointer = (clientX: number, clientY: number) => {
    const el = hourHandRef.current;
    if (!el) return null;
    return getAngleDegFromPointer(el, clientX, clientY);
  };

  const setOffsetFromPointer = (clientX: number, clientY: number) => {
    const base = new Date();
    const baseHourIndex = base.getHours() % 12; // 0..11

    const pointerAngle = getAngleFromPointer(clientX, clientY);
    if (pointerAngle === null) return;

    const snappedAngle = snapAngleToHour(pointerAngle); // 0..359 step of 30
    const targetHourIndex = snappedAngle / 30; // 0..11

    const diff = resolveHourOffset(baseHourIndex, targetHourIndex, offsetHours);

    onOffsetHoursChange?.(diff);
  };

  useEffect(() => {
    // Update only when the hour changes.
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

  const cssVars = {
    '--angle-deg': `${displayAngleDeg}deg`,
  } as CSSProperties;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // Only react to "primary" mouse button; touch events usually come with button=0.
    if (typeof e.button === 'number' && e.button !== 0) return;

    activePointerIdRef.current = e.pointerId;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);

    if (e.cancelable) e.preventDefault();
    setOffsetFromPointer(e.clientX, e.clientY);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    if (e.cancelable) e.preventDefault();
    setOffsetFromPointer(e.clientX, e.clientY);
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    activePointerIdRef.current = null;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Some browsers can throw if capture is already released.
    }
  };

  return (
    <div className={styles.clockMain} style={cssVars}>
      <div className={styles.dialNumbers} aria-hidden='true'>
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
      <div
        ref={hourHandRef}
        id='hour-hand'
        className={`${styles.hand} ${isDragging ? styles.handDragging : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label='Draggable clock hand'
      />
      <div className={styles.centerCap} />
    </div>
  );
}
