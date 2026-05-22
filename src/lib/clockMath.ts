export const HOUR_NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
export const DEGREES_PER_HOUR = 30;
export const HOURS_ON_DIAL = 12;

/** Keep degrees in 0..359 for dial math. */
export function normalizeAngleDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Map local device time to the hour-hand angle on a 12-hour dial. */
export function getHourHandAngle(date: Date): number {
  return (date.getHours() % HOURS_ON_DIAL) * DEGREES_PER_HOUR;
}

/** Snap a pointer angle to the nearest hour step. */
export function snapAngleToHour(deg: number): number {
  return normalizeAngleDeg(Math.round(deg / DEGREES_PER_HOUR) * DEGREES_PER_HOUR);
}

/** Apply main-clock offset (and optional ±1 preview) on top of the live base angle. */
export function getDisplayAngleDeg(
  baseAngleDeg: number,
  totalHourOffset: number,
): number {
  const raw = baseAngleDeg + totalHourOffset * DEGREES_PER_HOUR;
  return normalizeAngleDeg(raw);
}

/** Convert pointer coordinates to a dial angle (0deg at 12 o'clock, clockwise). */
export function getAngleDegFromPointer(
  el: HTMLDivElement,
  clientX: number,
  clientY: number,
): number {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = clientX - cx;
  const dy = clientY - cy;

  const rawDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  return normalizeAngleDeg(rawDeg + 90);
}
