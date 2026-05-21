import { render, screen } from '@testing-library/react';
import { ClockMinus } from './ClockMinus';

describe('ClockMinus', () => {
  it('renders description for -1 hour clock', () => {
    render(<ClockMinus />);
    expect(
      screen.getByText(/Clock -1 hour according main clock time/i),
    ).toBeInTheDocument();
  });
});
