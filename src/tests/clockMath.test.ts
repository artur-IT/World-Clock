/// <reference types="jest" />

import {
  getDisplayAngleDeg,
  getHourHandAngle,
  normalizeAngleDeg,
  snapAngleToHour,
} from '../lib/clockMath';

describe('clockMath', () => {
  it('normalizes negative and overflow angles', () => {
    expect(normalizeAngleDeg(-30)).toBe(330);
    expect(normalizeAngleDeg(390)).toBe(30);
  });

  it('maps hours to 30-degree steps', () => {
    expect(getHourHandAngle(new Date(2026, 0, 1, 3, 0, 0))).toBe(90);
    expect(getHourHandAngle(new Date(2026, 0, 1, 0, 0, 0))).toBe(0);
  });

  it('snaps pointer angles to hour steps', () => {
    expect(snapAngleToHour(44)).toBe(30);
    expect(snapAngleToHour(350)).toBe(0);
  });

  it('applies total hour offset on top of the base angle', () => {
    expect(getDisplayAngleDeg(90, 2)).toBe(150);
    expect(getDisplayAngleDeg(330, 1)).toBe(0);
  });
});
