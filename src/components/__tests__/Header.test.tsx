import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders title and subtitle', () => {
    render(<Header />);
    
    expect(screen.getByText('ICE Deportation Tracker')).toBeInTheDocument();
    expect(screen.getByText('Real-time tracking of ICE enforcement actions')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-ice-blue');
  });
}); 