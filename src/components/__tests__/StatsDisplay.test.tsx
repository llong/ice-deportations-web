import { render, screen } from "@testing-library/react";
import { StatsDisplay } from "../StatsDisplay";
import { mockDeportationData } from "../../utils/test-utils";

describe("StatsDisplay", () => {
  it("renders all stats correctly", () => {
    render(<StatsDisplay data={mockDeportationData} loading={false} />);

    // Check totals
    expect(screen.getByText("375")).toBeInTheDocument(); // Total arrests
    expect(screen.getByText("185")).toBeInTheDocument(); // Total detainers

    // Check averages
    expect(screen.getByText("125")).toBeInTheDocument(); // Daily average arrests
    expect(screen.getByText("62")).toBeInTheDocument(); // Daily average detainers

    // Check titles
    expect(screen.getByText("Total Arrests")).toBeInTheDocument();
    expect(screen.getByText("Total Detainers")).toBeInTheDocument();
    expect(screen.getByText("Daily Avg. Detainers")).toBeInTheDocument();
  });

  it("formats numbers correctly", () => {
    const largeData = [
      {
        date: "2024-01-01",
        arrests: 1000000,
        detainers: 500000,
        imageUrl: "test.jpg",
      },
    ];
    render(<StatsDisplay data={largeData} loading={false} />);

    expect(screen.getAllByText("1,000,000")[0]).toBeInTheDocument();
    expect(screen.getAllByText("500,000")[0]).toBeInTheDocument();
  });
});
