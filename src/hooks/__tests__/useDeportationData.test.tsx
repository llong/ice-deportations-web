import { renderHook, act } from "@testing-library/react";
import { useDeportationData } from "../useDeportationData";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createTestQueryClient,
  mockDeportationData,
} from "../../utils/test-utils";
import { vi } from "vitest";
import {
  fetchDeportationData,
  fetchFreshData,
} from "../../services/deportationService";

// Mock the deportation service module
vi.mock("../../services/deportationService", () => ({
  fetchDeportationData: vi.fn(),
  fetchFreshData: vi.fn(),
}));

describe("useDeportationData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.mocked(fetchDeportationData).mockResolvedValue({
      data: mockDeportationData,
      isStale: false,
    });
    vi.mocked(fetchFreshData).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial loading state", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeportationData(), { wrapper });

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();

    // Advance past debounce and wait for state updates
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
      // Wait for promises to resolve
      await vi.runAllTimersAsync();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockDeportationData);
  });

  it("should handle stale data", async () => {
    vi.mocked(fetchDeportationData)
      .mockResolvedValueOnce({
        data: mockDeportationData.slice(0, 2), // Only use first 2 items initially
        isStale: true,
      })
      .mockResolvedValueOnce({
        data: mockDeportationData, // Use all 3 items for fresh data
        isStale: false,
      });

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeportationData(), { wrapper });

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);

    // Advance past debounce and wait for state updates
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
      // Wait for promises to resolve
      await vi.runAllTimersAsync();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toHaveLength(3);
    expect(vi.mocked(fetchFreshData)).toHaveBeenCalledTimes(1);
  });

  it("should handle errors", async () => {
    vi.mocked(fetchDeportationData).mockRejectedValue(
      new Error("Failed to fetch")
    );

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeportationData(), { wrapper });

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Advance past debounce and wait for state updates
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
      // Wait for promises to resolve
      await vi.runAllTimersAsync();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch");
  });
});
