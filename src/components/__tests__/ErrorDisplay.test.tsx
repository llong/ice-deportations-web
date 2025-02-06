import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorDisplay } from "../ErrorDisplay";
import { vi } from "vitest";

describe("ErrorDisplay", () => {
  const mockError = new Error("Test error message");
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: vi.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("renders error message correctly", () => {
    render(<ErrorDisplay error={mockError} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("renders default error message when no message provided", () => {
    render(<ErrorDisplay error={new Error()} />);

    expect(
      screen.getByText("Failed to load deportation data")
    ).toBeInTheDocument();
  });

  it("reloads page when try again button is clicked", () => {
    render(<ErrorDisplay error={mockError} />);

    const button = screen.getByRole("button", { name: "Try Again" });
    fireEvent.click(button);

    expect(window.location.reload).toHaveBeenCalled();
  });
});
