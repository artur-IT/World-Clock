/// <reference types="jest" />

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

  it('clamps offset to ±11 hours from the current hour', () => {
    expect(resolveHourOffset(1, 2, 0)).toBe(1);
    expect(resolveHourOffset(1, 2, 12)).toBe(1);
    expect(resolveHourOffset(1, 2, -12)).toBe(-11);
  });
});

describe('unwrapDisplayAngle', () => {
  it('rotates left one hour instead of spinning 11 hours right', () => {
    expect(unwrapDisplayAngle(0, 330)).toBe(-30);
  });
});
