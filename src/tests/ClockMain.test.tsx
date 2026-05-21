/// <reference types="jest" />

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ClockMain } from '../components/ClockMain';

function expectedHour12(hour24: number) {
  const h12 = hour24 % 12;
  return h12 === 0 ? 12 : h12;
}

function expectedAngleDeg(hour24: number) {
  const h12 = hour24 % 12;
  return h12 * 30;
}

describe('ClockMain', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sets aria-label and angle for initial mocked time', () => {
    const hour24 = 1;
    const mockedNow = new Date(2020, 0, 1, hour24, 23, 0, 0);
    jest.setSystemTime(mockedNow);

    render(<ClockMain />);

    const clock = screen.getByRole('img', { name: /Analog clock/i });

    const hour12 = expectedHour12(hour24);
    expect(clock).toHaveAttribute(
      'aria-label',
      `Analog clock. Current hour: ${String(hour12).padStart(2, '0')}.`,
    );

    const angleDeg = expectedAngleDeg(hour24);
    const styleAttr = clock.getAttribute('style') ?? '';
    expect(styleAttr).toContain(`--angle-deg: ${angleDeg}deg`);
  });
});
