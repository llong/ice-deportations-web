import { render, screen } from "@testing-library/react";
import { PredictionDisplay } from "../PredictionDisplay";

describe("PredictionDisplay", () => {
  it("renders predictions correctly with sufficient data", () => {
    const data = [
      { date: "2024-01-01", arrests: 100, detainers: 50 },
      { date: "2024-01-02", arrests: 150, detainers: 75 },
      { date: "2024-01-03", arrests: 200, detainers: 100 },
    ];

    render(<PredictionDisplay data={data} />);
    expect(screen.getAllByText(/Predictions/i)[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("predictions-grid")[0]).toHaveClass(
      "grid",
      "grid-cols-1",
      "md:grid-cols-3",
      "gap-4"
    );
  });

  it("handles insufficient data", () => {
    const data = [{ date: "2024-01-01", arrests: 100, detainers: 50 }];
    render(<PredictionDisplay data={data} />);
    expect(
      screen.getByText(/Insufficient data for predictions/i)
    ).toBeInTheDocument();
  });

  it("handles empty data", () => {
    render(<PredictionDisplay data={[]} />);
    expect(
      screen.getByText(/Insufficient data for predictions/i)
    ).toBeInTheDocument();
  });

  it("handles null data", () => {
    render(<PredictionDisplay data={null} />);
    expect(
      screen.getByText(/Insufficient data for predictions/i)
    ).toBeInTheDocument();
  });
});
