/// <reference types="jest" />

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { WorldMap } from '../components/WorldMap';

describe('WorldMap', () => {
  it('renders map placeholder text', () => {
    render(<WorldMap />);
    expect(screen.getByText(/World Map/i)).toBeInTheDocument();
  });
});
