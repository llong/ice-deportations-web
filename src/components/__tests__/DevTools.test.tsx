import { render, screen } from "@testing-library/react";
import { DevTools } from "../DevTools";

describe("DevTools", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeAll(() => {
    process.env.NODE_ENV = "development";
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("renders development tools in dev mode", () => {
    render(<DevTools loading={false} onForceRefresh={vi.fn()} />);
    expect(
      screen.getAllByText(/Test Image Processing/i).length
    ).toBeGreaterThan(0);

    expect(screen.getByPlaceholderText(/Enter image URL/i)).toBeInTheDocument();
  });

  it("doesn't render in production", () => {
    process.env.NODE_ENV = "production";
    render(<DevTools loading={false} onForceRefresh={vi.fn()} />);
    expect(
      screen.queryByText(/Test Image Processing/i)
    ).not.toBeInTheDocument();
  });
});
