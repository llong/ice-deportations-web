import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders loading spinner with accessible text", () => {
    render(<LoadingSpinner />);

    // Check for status role
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();

    // Check for loading text
    const loadingText = screen.getByText("Loading deportation data...");
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveClass("sr-only");

    // Check for spinner animation element
    const animatedSpinner = screen.getByTestId("spinner-animation");
    expect(animatedSpinner).toBeInTheDocument();
    expect(animatedSpinner).toHaveClass("animate-spin");
  });

  it("applies correct styling", () => {
    render(<LoadingSpinner />);

    // Check container styling
    const container = screen.getByRole("status");
    expect(container).toHaveClass(
      "flex",
      "justify-center",
      "items-center",
      "h-64"
    );
  });
});
