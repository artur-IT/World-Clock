import { useMemo } from 'react';
import { getDisplayAngleDeg } from '../../lib/clockMath';
import { useHourHandBaseAngle } from './useHourHandBaseAngle';
import { useUnwrappedDisplayAngle } from './useUnwrappedDisplayAngle';

/** Live base angle plus offset, with smooth shortest-path rotation. */
export function useClockHandAngle(
  offsetHours = 0,
  hourDelta = 0,
): number {
  const baseAngleDeg = useHourHandBaseAngle();

  const angleDeg = useMemo(
    () => getDisplayAngleDeg(baseAngleDeg, offsetHours + hourDelta),
    [baseAngleDeg, offsetHours, hourDelta],
  );

  return useUnwrappedDisplayAngle(angleDeg);
}
