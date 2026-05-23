/// <reference types="jest" />

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HOUR_NUMBERS } from '../lib/clockMath';
import { SmallClock } from '../components/SmallClock';

describe('SmallClock', () => {
  it.each([
    { variant: 'plus' as const, title: '+1 Hour' },
    { variant: 'minus' as const, title: '-1 Hour' },
  ])('renders $title mini analog clock', ({ variant, title }) => {
    render(<SmallClock variant={variant} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it.each(['plus', 'minus'] as const)(
    'renders the clock hand for %s',
    (variant) => {
      const { container } = render(<SmallClock variant={variant} />);
      const hand = container.querySelector('div[style*="0.4rem"]');
      expect(hand).toBeInTheDocument();
    },
  );

  it.each(['plus', 'minus'] as const)(
    'renders dial hour numbers for %s',
    (variant) => {
      render(<SmallClock variant={variant} />);

      for (const n of HOUR_NUMBERS) {
        expect(
          screen.getByText(String(n), { exact: true }),
        ).toBeInTheDocument();
      }
    },
  );
});
