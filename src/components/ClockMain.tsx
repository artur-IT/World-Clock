import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';

import styles from '../styles/clockMain.module.css';
import { HourNumbers } from './HourNumbers';
import { useClockHandAngle } from './hooks/useClockHandAngle';
import {
  DEGREES_PER_HOUR,
  getAngleDegFromPointer,
  HOURS_ON_DIAL,
  snapAngleToHour,
} from '../lib/clockMath';
import { resolveHourOffset } from '../lib/resolveHourOffset';

type ClockMainProps = {
  offsetHours?: number;
  onOffsetHoursChange?: (offsetHours: number) => void;
};

/** Interactive main clock; drag the hour hand to change the shared UTC offset. */
export function ClockMain({
  offsetHours = 0,

  onOffsetHoursChange,
}: ClockMainProps) {
  const displayAngleDeg = useClockHandAngle(offsetHours);
  const hourHandRef = useRef<HTMLDivElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  /** Convert pointer coordinates to a dial angle from the hour-hand center. */
  const getAngleFromPointer = (clientX: number, clientY: number) => {
    const el = hourHandRef.current;

    if (!el) return null;

    return getAngleDegFromPointer(el, clientX, clientY);
  };

  /** Snap pointer to an hour and notify parent with the closest wrap-aware offset. */
  const setOffsetFromPointer = (clientX: number, clientY: number) => {
    const base = new Date();
    const baseHourIndex = base.getHours() % HOURS_ON_DIAL;
    const pointerAngle = getAngleFromPointer(clientX, clientY);

    if (pointerAngle === null) return;

    const snappedAngle = snapAngleToHour(pointerAngle);
    const targetHourIndex = snappedAngle / DEGREES_PER_HOUR;
    const diff = resolveHourOffset(baseHourIndex, targetHourIndex, offsetHours);

    onOffsetHoursChange?.(diff);
  };

  const cssVars = useMemo(
    () => ({ '--angle-deg': `${displayAngleDeg}deg` }) as CSSProperties,
    [displayAngleDeg],
  );

  /** Start drag on primary button and capture pointer for move/up events. */
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (typeof e.button === 'number' && e.button !== 0) return;

    activePointerIdRef.current = e.pointerId;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);

    if (e.cancelable) e.preventDefault();
    setOffsetFromPointer(e.clientX, e.clientY);
  };

  /** Update offset while the captured pointer moves. */
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    if (e.cancelable) e.preventDefault();

    setOffsetFromPointer(e.clientX, e.clientY);
  };

  /** End drag and release pointer capture. */
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
      <HourNumbers ariaHidden />

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
