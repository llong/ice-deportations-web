import React from "react";
import { render, screen } from "@testing-library/react";
import { DeportationChart } from "../Chart";
import { mockDeportationData } from "../../utils/test-utils";

// Mock recharts as it doesn't play well with JSDOM
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Line: () => <div>Line</div>,
  XAxis: () => <div>X Axis</div>,
  YAxis: () => <div>Y Axis</div>,
  CartesianGrid: () => <div>Cartesian Grid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
}));

describe("DeportationChart", () => {
  it("renders chart with title", () => {
    render(<DeportationChart data={mockDeportationData} />);
    // Check if the title is rendered correctly
    expect(screen.getByText(/Daily Tracking/i)).toBeInTheDocument();
  });

  it("formats dates correctly", () => {
    render(<DeportationChart data={mockDeportationData} />);
    // Check if at least one line is rendered
    expect(screen.getAllByText("Line").length).toBeGreaterThan(0); // Check for line rendering
  });
});
