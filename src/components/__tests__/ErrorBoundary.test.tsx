import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";

describe("ErrorBoundary", () => {
  const ThrowError = () => {
    throw new Error("Test error");
  };

  it("renders error UI when error occurs", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Try Again/i })
    ).toBeInTheDocument();

    spy.mockRestore();
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
