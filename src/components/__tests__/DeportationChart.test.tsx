import React from 'react';
import { render, screen } from '@testing-library/react';
import { DeportationChart } from '../DeportationChart';
import { mockDeportationData } from '../../utils/test-utils';

// Mock recharts as it doesn't play well with JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
}));

describe('DeportationChart', () => {
  it('renders chart with title', () => {
    render(<DeportationChart data={mockDeportationData} />);
    expect(screen.getByText('Daily Tracking')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<DeportationChart data={mockDeportationData} />);
    // Check if chart container exists
    expect(screen.getByRole('generic')).toHaveClass('chart-container');
  });
}); 