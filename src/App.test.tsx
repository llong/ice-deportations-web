import { screen } from "@testing-library/react";
import { renderWithClient, mockDeportationData } from "./utils/test-utils";
import App from "./App";
import * as hooks from "./hooks/useDeportationData";
import { vi } from "vitest";
vi.mock("./hooks/useDeportationData");

describe("App", () => {
  it("shows loading state", () => {
    vi.spyOn(hooks, "useDeportationData").mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithClient(<App />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error state", () => {
    vi.spyOn(hooks, "useDeportationData").mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Test error"),
    } as any);

    renderWithClient(<App />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders main content when data is loaded", () => {
    vi.spyOn(hooks, "useDeportationData").mockReturnValue({
      data: mockDeportationData,
      isLoading: false,
      error: null,
    } as any);

    renderWithClient(<App />);
    expect(screen.getByText("Daily Tracking")).toBeInTheDocument();
  });
});
