/// <reference types="jest" />

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ClockPlus } from '../components/ClockPlus';

describe('ClockPlus', () => {
  it('renders mini analog clock for +1 hour', () => {
    render(<ClockPlus />);
    expect(
      screen.getByRole('img', { name: /Analog mini clock \+1 hour/i }),
    ).toBeInTheDocument();
  });
});
