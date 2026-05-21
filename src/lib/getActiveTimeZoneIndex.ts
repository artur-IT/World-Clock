export const UTC_OFFSET_MIN = -12;
export const UTC_OFFSET_MAX = 12;
export const TIME_ZONE_COUNT = UTC_OFFSET_MAX - UTC_OFFSET_MIN + 1;

export const UTC_OFFSETS = Array.from(
  { length: TIME_ZONE_COUNT },
  (_, index) => UTC_OFFSET_MIN + index,
);

/** Static header label for a UTC offset column (-12 … +12). */
export function formatUtcOffsetLabel(offset: number): string {
  if (offset === 0) return '0';
  return offset > 0 ? `+${offset}` : String(offset);
}

/** Map main-clock drag offset to a fixed zone column index (0–24). */
export function getActiveTimeZoneIndex(offsetHours = 0): number {
  const clampedOffset = Math.max(
    UTC_OFFSET_MIN,
    Math.min(UTC_OFFSET_MAX, offsetHours),
  );
  return clampedOffset - UTC_OFFSET_MIN;
}
