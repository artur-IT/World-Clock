const MAX_OFFSET_HOURS = 12;

/** Pick offset closest to the current drag position, clamped to ±12 hours. */
export function resolveHourOffset(
  baseHourIndex: number,
  targetHourIndex: number,
  currentOffset: number,
): number {
  const forward =
    (targetHourIndex - baseHourIndex + 12) % 12; // 0..11 clockwise steps

  // Same dial position can mean 0, +12, or -12; keep dragging past ±11.
  const candidates = forward === 0 ? [0, 12, -12] : [forward, forward - 12];

  let best = candidates[0];
  let bestDistance = Math.abs(candidates[0] - currentOffset);

  for (let i = 1; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    const distance = Math.abs(candidate - currentOffset);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }

  return Math.max(-MAX_OFFSET_HOURS, Math.min(MAX_OFFSET_HOURS, best));
}

/** Keep CSS rotation on the shortest path between hour steps. */
export function unwrapDisplayAngle(
  prevUnwrapped: number,
  nextNormalized: number,
): number {
  const prevNorm = ((prevUnwrapped % 360) + 360) % 360;
  let delta = nextNormalized - prevNorm;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return prevUnwrapped + delta;
}
