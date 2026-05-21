/// <reference types="jest" />

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ClockMinus } from '../components/ClockMinus';

describe('ClockMinus', () => {
  it('renders mini analog clock for -1 hour', () => {
    render(<ClockMinus />);
    expect(
      screen.getByRole('img', { name: /Analog mini clock -1 hour/i }),
    ).toBeInTheDocument();
  });
});
