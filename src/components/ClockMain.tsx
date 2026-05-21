import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../styles/clockMain.module.css';

function getHourHandAngle(date: Date) {
  const h12 = date.getHours() % 12;
  return h12 * 30; // 360 / 12 = 30 deg per hour
}

const DIAL_NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

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

  const angleDeg = useMemo(() => {
    const raw = baseAngleDeg + offsetHours * 30;
    return ((raw % 360) + 360) % 360; // normalize to 0..359
  }, [baseAngleDeg, offsetHours]);

  function snapAngleToHour(deg: number) {
    const snapped = Math.round(deg / 30) * 30;
    return ((snapped % 360) + 360) % 360; // ensure 0..359
  }

  function angleFromPointer(clientX: number, clientY: number) {
    const el = hourHandRef.current;
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;

    // Avoid weird jumps when the pointer is very close to the center.
    const minDistPx = Math.max(10, rect.width * 0.05);
    if (dx * dx + dy * dy < minDistPx * minDistPx) return null;

    // 0deg at 12 o'clock, increasing clockwise.
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    return (deg + 90 + 360) % 360;
  }

  function setOffsetFromPointer(clientX: number, clientY: number) {
    const base = new Date();
    const baseHourIndex = base.getHours() % 12; // 0..11

    const pointerAngle = angleFromPointer(clientX, clientY);
    if (pointerAngle === null) return;

    const snappedAngle = snapAngleToHour(pointerAngle); // 0..359 step of 30
    const targetHourIndex = snappedAngle / 30; // 0..11

    // Choose the shortest signed shift in range roughly [-6..6].
    let diff = (targetHourIndex - baseHourIndex + 12) % 12; // 0..11 forward steps
    if (diff > 6) diff -= 12; // map to negative steps

    onOffsetHoursChange?.(diff);
  }

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

  const cssVars = { '--angle-deg': `${angleDeg}deg` } as React.CSSProperties;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Left mouse button only (touch/pen has button=0 or undefined depending on browser).
    if (typeof e.button === 'number' && e.button !== 0) return;

    activePointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);

    if (e.cancelable) e.preventDefault();
    setOffsetFromPointer(e.clientX, e.clientY);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (activePointerIdRef.current !== e.pointerId) return;
    if (e.cancelable) e.preventDefault();
    setOffsetFromPointer(e.clientX, e.clientY);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (activePointerIdRef.current !== e.pointerId) return;
    activePointerIdRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Some browsers can throw if capture is already released.
    }
  }

  return (
    <div className={styles.clockMain} style={cssVars} role='img'>
      <div className={styles.dialNumbers} aria-hidden='true'>
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
      <div
        ref={hourHandRef}
        id='hour-hand'
        className={styles.hand}
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
