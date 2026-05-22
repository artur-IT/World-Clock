/// <reference types="jest" />

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ClockPlus } from '../components/ClockPlus';

describe('ClockPlus', () => {
  it('renders mini analog clock for +1 Hour', () => {
    render(<ClockPlus />);
    expect(screen.getByText('+1 Hour')).toBeInTheDocument();
  });

  it('renders the clock hand', () => {
    const { container } = render(<ClockPlus />);

    // The hand is a <div> with an inline style: { width: "0.4rem" }.
    const hand = container.querySelector('div[style*="0.4rem"]');
    expect(hand).toBeInTheDocument();
  });

  it('renders dial hour numbers', () => {
    render(<ClockPlus />);

    const dialNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
    for (const n of dialNumbers) {
      expect(screen.getByText(String(n), { exact: true })).toBeInTheDocument();
    }
  });
});
