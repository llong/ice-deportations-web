import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders footer text', () => {
    render(<Footer />);
    expect(screen.getByText(/Data sourced from/)).toBeInTheDocument();
  });

  it('shows current date', () => {
    render(<Footer />);
    const today = new Date().toLocaleDateString();
    expect(screen.getByText(RegExp(today))).toBeInTheDocument();
  });
}); 