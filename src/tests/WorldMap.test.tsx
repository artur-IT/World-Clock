import { render, screen } from '@testing-library/react';
import { WorldMap } from './WorldMap';

describe('WorldMap', () => {
  it('renders map placeholder text', () => {
    render(<WorldMap />);
    expect(screen.getByText(/World Map/i)).toBeInTheDocument();
  });
});
