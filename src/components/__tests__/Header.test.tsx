import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

describe("Header", () => {
  it("renders title and subtitle", () => {
    render(<Header onForceRefresh={() => Promise.resolve()} loading={false} />);

    expect(screen.getByText(/ICE Deportation Tracker/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Real-time tracking of ICE enforcement/i)
    ).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    render(<Header onForceRefresh={() => Promise.resolve()} loading={false} />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass(
      "bg-gradient-to-r",
      "from-blue-600",
      "to-blue-800"
    );
  });
});
