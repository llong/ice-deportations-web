import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { vi } from "vitest";

// Mock chart.js using Vitest's vi.mock
vi.mock("chart.js", () => ({
  Chart: {
    register: vi.fn(),
    defaults: {},
    controllers: {},
    scales: {},
    elements: {},
  },
  registerables: [],
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  Filler: vi.fn(),
}));

// Mock components
vi.mock("./components/DeportationChart", () => ({
  DeportationChart: () => null,
}));

vi.mock("./components/StatsDisplay", () => ({
  StatsDisplay: () => null,
}));

vi.mock("./components/Header", () => ({
  Header: () => null,
}));

vi.mock("./components/Footer", () => ({
  Footer: () => null,
}));

vi.mock("react-hot-toast", () => ({
  Toaster: () => null,
}));

// Mock fetch with complete Response properties
global.fetch = vi.fn((_input: RequestInfo | URL, _init?: RequestInit) =>
  Promise.resolve(
    new Response(JSON.stringify({ success: true }), {
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
  )
) as unknown as jest.Mock;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

describe("App", () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for the main container to be rendered
    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });
});
