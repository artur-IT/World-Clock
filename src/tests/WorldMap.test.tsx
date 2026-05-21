/// <reference types="jest" />

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { WorldMap } from '../components/WorldMap';
import {
  formatUtcOffsetLabel,
  getActiveTimeZoneIndex,
  TIME_ZONE_COUNT,
  UTC_OFFSETS,
} from '../lib/getActiveTimeZoneIndex';

describe('formatUtcOffsetLabel', () => {
  it('formats offsets from -12 to +12', () => {
    expect(formatUtcOffsetLabel(-12)).toBe('-12');
    expect(formatUtcOffsetLabel(0)).toBe('0');
    expect(formatUtcOffsetLabel(12)).toBe('+12');
  });
});

describe('getActiveTimeZoneIndex', () => {
  it('maps main-clock offset to zone index 0..24', () => {
    expect(getActiveTimeZoneIndex(0)).toBe(12);
    expect(getActiveTimeZoneIndex(3)).toBe(15);
    expect(getActiveTimeZoneIndex(-5)).toBe(7);
  });

  it('clamps offset to the -12..+12 zone range', () => {
    expect(getActiveTimeZoneIndex(-20)).toBe(0);
    expect(getActiveTimeZoneIndex(20)).toBe(24);
  });
});

describe('UTC_OFFSETS', () => {
  it('lists 25 offsets from -12 through +12', () => {
    expect(TIME_ZONE_COUNT).toBe(25);
    expect(UTC_OFFSETS[0]).toBe(-12);
    expect(UTC_OFFSETS[24]).toBe(12);
  });
});

describe('WorldMap', () => {
  it('renders absolute headers from -12 to +12', () => {
    render(<WorldMap offsetHours={0} />);

    UTC_OFFSETS.forEach((offset) => {
      expect(screen.getByText(formatUtcOffsetLabel(offset))).toBeInTheDocument();
    });
  });

  it('highlights UTC+0 by default and moves only the highlight on drag', () => {
    const { container, rerender } = render(<WorldMap offsetHours={0} />);

    expect(container.querySelector('[aria-current="true"]')).toHaveAttribute(
      'data-zone-index',
      '12',
    );

    rerender(<WorldMap offsetHours={3} />);

    expect(container.querySelector('[aria-current="true"]')).toHaveAttribute(
      'data-zone-index',
      '15',
    );
    expect(
      container.querySelector('[data-zone-offset="3"] [aria-current="true"]'),
    ).toBeInTheDocument();
  });
});
