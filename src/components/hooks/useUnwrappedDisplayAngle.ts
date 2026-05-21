import { useEffect, useRef, useState } from 'react';
import { unwrapDisplayAngle } from '../../lib/resolveHourOffset';

/** Smooth hour-hand rotation without spinning the long way around the dial. */
export function useUnwrappedDisplayAngle(angleDeg: number): number {
  const [displayAngleDeg, setDisplayAngleDeg] = useState(angleDeg);
  const displayAngleRef = useRef(angleDeg);

  useEffect(() => {
    const next = unwrapDisplayAngle(displayAngleRef.current, angleDeg);
    displayAngleRef.current = next;
    setDisplayAngleDeg(next);
  }, [angleDeg]);

  return displayAngleDeg;
}
