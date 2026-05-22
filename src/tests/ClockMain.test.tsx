/// <reference types="jest" />

import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';

import styles from '../styles/clockMain.module.css';
import { ClockMain } from '../components/ClockMain';
import {
  resolveHourOffset,
  unwrapDisplayAngle,
} from '../lib/resolveHourOffset';

describe('resolveHourOffset', () => {
  it('keeps dragging left past 12 when the current hour is 1', () => {
    const baseHourIndex = 1;
    const target12 = 0;
    const target11 = 11;

    expect(resolveHourOffset(baseHourIndex, target12, 0)).toBe(-1);
    expect(resolveHourOffset(baseHourIndex, target11, -1)).toBe(-2);
  });

  it('clamps offset to ±12 hours from the current hour', () => {
    expect(resolveHourOffset(1, 2, 0)).toBe(1);
    expect(resolveHourOffset(1, 2, 12)).toBe(1);
    expect(resolveHourOffset(1, 2, -12)).toBe(-11);
  });

  it('reaches +12 or -12 instead of jumping back to 0', () => {
    expect(resolveHourOffset(3, 3, 11)).toBe(12);
    expect(resolveHourOffset(3, 3, -11)).toBe(-12);
  });
});

describe('unwrapDisplayAngle', () => {
  it('rotates left one hour instead of spinning 11 hours right', () => {
    expect(unwrapDisplayAngle(0, 330)).toBe(-30);
  });
});

describe('ClockMain', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function setLocalTimeHours(hours: number) {
    // Keep it local: jsdom uses local timezone for Date#getHours.
    jest.setSystemTime(new Date(2026, 0, 1, hours, 15, 0, 0));
  }

  function getAngleDeg(clockMainEl: HTMLElement) {
    return clockMainEl.style.getPropertyValue('--angle-deg');
  }

  function setDeterministicHandGeometry(handEl: HTMLElement) {
    // Make math deterministic for angleFromPointer() in ClockMain.
    handEl.getBoundingClientRect = jest.fn(() => ({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      x: 100,
      y: 100,
      right: 300,
      bottom: 300,
      toJSON: () => {},
    })) as unknown as () => DOMRect;

    // Prevent jsdom/browser differences around pointer capture APIs.
    (
      handEl as unknown as { setPointerCapture?: (id: number) => void }
    ).setPointerCapture = jest.fn();
    (
      handEl as unknown as { releasePointerCapture?: (id: number) => void }
    ).releasePointerCapture = jest.fn();
  }

  // Geometry used in tests. We keep it hard-coded so drag math is predictable.
  const CLOCK_CENTER_X = 200;
  const CLOCK_CENTER_Y = 200;
  const CLOCK_RADIUS = 80;

  function getClientPointFromPointerAngle(pointerAngleDeg: number) {
    // In ClockMain:
    // 1) deg = atan2(dy, dx) in degrees
    // 2) pointerAngle = (deg + 90) mod 360
    // We reverse it to pick a clientX/clientY that corresponds to pointerAngle.
    const thetaDeg = pointerAngleDeg - 90;
    const thetaRad = (thetaDeg * Math.PI) / 180;

    const dx = CLOCK_RADIUS * Math.cos(thetaRad);
    const dy = CLOCK_RADIUS * Math.sin(thetaRad);

    return {
      clientX: CLOCK_CENTER_X + dx,
      clientY: CLOCK_CENTER_Y + dy,
    };
  }

  type PointerDispatchArgs = {
    pointerId: number;
    button?: number;
    clientX?: number;
    clientY?: number;
  };

  function dispatchPointerEvent(
    el: HTMLElement,
    type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
    { pointerId, button, clientX, clientY }: PointerDispatchArgs,
  ) {
    // jsdom in this repo might not provide PointerEvent, so we create a plain Event
    // and attach the pointer fields manually.
    const event = new Event(type, {
      bubbles: true,
      cancelable: true,
    });
    const anyEvent = event as unknown as {
      pointerId: number;
      button: number;
      clientX: number;
      clientY: number;
    };

    anyEvent.pointerId = pointerId;
    anyEvent.button = button ?? 0;
    anyEvent.clientX = clientX ?? 0;
    anyEvent.clientY = clientY ?? 0;

    el.dispatchEvent(event);
  }

  it('renders dial numbers and draggable hand', () => {
    const { container } = render(<ClockMain />);

    const clockMainEl = container.firstElementChild as HTMLElement;
    expect(clockMainEl).toBeInTheDocument();

    expect(screen.getByLabelText('Draggable clock hand')).toBeInTheDocument();

    // Visible dial numbers.
    for (const n of [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const) {
      expect(screen.getByText(String(n), { exact: true })).toBeInTheDocument();
    }
  });

  it('sets --angle-deg based on time and offsetHours', () => {
    setLocalTimeHours(0); // baseAngleDeg = 0

    const { container, rerender } = render(<ClockMain offsetHours={0} />);
    const clockMainEl = container.firstElementChild as HTMLElement;

    expect(getAngleDeg(clockMainEl).trim()).toBe('0deg');

    rerender(<ClockMain offsetHours={1} />);
    expect(getAngleDeg(clockMainEl).trim()).toBe('30deg');
  });

  it('uses unwrapped angle (shortest rotation) across 0/360 boundary', async () => {
    setLocalTimeHours(0); // baseAngleDeg = 0

    const { container, rerender } = render(<ClockMain offsetHours={0} />);
    const clockMainEl = container.firstElementChild as HTMLElement;

    expect(getAngleDeg(clockMainEl).trim()).toBe('0deg');

    // Normalized angle for offsetHours=11 is 330deg, but unwrapped should go to -30deg.
    rerender(<ClockMain offsetHours={11} />);

    await waitFor(() => {
      expect(getAngleDeg(clockMainEl).trim()).toBe('-30deg');
    });
  });

  it('calls onOffsetHoursChange with resolved offset after pointer down', () => {
    setLocalTimeHours(1); // baseHourIndex = 1

    const onOffsetHoursChange = jest.fn();
    const { container } = render(
      <ClockMain offsetHours={0} onOffsetHoursChange={onOffsetHoursChange} />,
    );

    const clockMainEl = container.firstElementChild as HTMLElement;
    expect(getAngleDeg(clockMainEl).trim()).toBe('30deg'); // 1 hour at start

    const handEl = screen.getByLabelText('Draggable clock hand');
    setDeterministicHandGeometry(handEl);

    // pointerAngle 0deg corresponds to targetHourIndex = 0 (12 o'clock).
    const { clientX, clientY } = getClientPointFromPointerAngle(0);

    act(() => {
      dispatchPointerEvent(handEl, 'pointerdown', {
        pointerId: 1,
        button: 0,
        clientX,
        clientY,
      });
    });

    const expected = resolveHourOffset(1, 0, 0);
    expect(onOffsetHoursChange).toHaveBeenCalledTimes(1);
    expect(onOffsetHoursChange).toHaveBeenLastCalledWith(expected);
  });

  it('pointer move ignores events from other pointerId', () => {
    setLocalTimeHours(1); // baseHourIndex = 1

    const onOffsetHoursChange = jest.fn();
    const { container } = render(
      <ClockMain offsetHours={0} onOffsetHoursChange={onOffsetHoursChange} />,
    );

    const clockMainEl = container.firstElementChild as HTMLElement;
    expect(getAngleDeg(clockMainEl).trim()).toBe('30deg');

    const handEl = screen.getByLabelText('Draggable clock hand');
    setDeterministicHandGeometry(handEl);

    const p1 = getClientPointFromPointerAngle(0); // target 12 -> targetHourIndex=0
    const p2 = getClientPointFromPointerAngle(30); // target 1 -> targetHourIndex=1

    act(() => {
      dispatchPointerEvent(handEl, 'pointerdown', {
        pointerId: 1,
        button: 0,
        clientX: p1.clientX,
        clientY: p1.clientY,
      });
    });

    onOffsetHoursChange.mockClear();

    // Wrong pointer id: should not call.
    act(() => {
      dispatchPointerEvent(handEl, 'pointermove', {
        pointerId: 2,
        clientX: p2.clientX,
        clientY: p2.clientY,
      });
    });
    expect(onOffsetHoursChange).not.toHaveBeenCalled();

    // Correct pointer id: should call.
    act(() => {
      dispatchPointerEvent(handEl, 'pointermove', {
        pointerId: 1,
        clientX: p2.clientX,
        clientY: p2.clientY,
      });
    });

    const expected = resolveHourOffset(1, 1, 0);
    expect(onOffsetHoursChange).toHaveBeenCalledTimes(1);
    expect(onOffsetHoursChange).toHaveBeenLastCalledWith(expected);
  });

  it('pointer up stops dragging (handDragging class)', () => {
    setLocalTimeHours(1);

    const { unmount } = render(<ClockMain offsetHours={0} />);

    const handEl = screen.getByLabelText('Draggable clock hand');
    setDeterministicHandGeometry(handEl);

    const { clientX, clientY } = getClientPointFromPointerAngle(0);

    act(() => {
      dispatchPointerEvent(handEl, 'pointerdown', {
        pointerId: 1,
        button: 0,
        clientX,
        clientY,
      });
    });

    expect(handEl.className).toContain(styles.handDragging);

    act(() => {
      dispatchPointerEvent(handEl, 'pointerup', {
        pointerId: 1,
        clientX,
        clientY,
      });
    });

    expect(handEl.className).not.toContain(styles.handDragging);

    // avoid leaving fake timers in odd states
    unmount();
  });
});
