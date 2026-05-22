import { useEffect, useState } from 'react';
import { getHourHandAngle } from '../../lib/clockMath';

/** Sync the hour hand with the device clock, updating once per hour. */
export function useHourHandBaseAngle(): number {
  const [baseAngleDeg, setBaseAngleDeg] = useState(() =>
    getHourHandAngle(new Date()),
  );

  useEffect(() => {
    let timeoutId: number | undefined;

    /** Refresh base angle now and schedule the next update at the top of the hour. */
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

  return baseAngleDeg;
}
