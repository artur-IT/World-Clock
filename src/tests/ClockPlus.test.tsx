import { render, screen } from '@testing-library/react';
import { ClockPlus } from './ClockPlus';

describe('ClockPlus', () => {
  it('renders description for +1 hour clock', () => {
    render(<ClockPlus />);
    expect(
      screen.getByText(/Clock \+1 hour according main clock time/i),
    ).toBeInTheDocument();
  });
});
