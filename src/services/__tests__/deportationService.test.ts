import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  fetchDeportationData,
  updateDeportationData,
  fetchFreshData,
} from "../deportationService";
import { supabase } from "../../lib/supabase";
import * as apiModule from "../api";

// Mock API module
vi.mock("../api");

describe("deportationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches deportation data successfully", async () => {
    const mockData = [{ date: "2024-01-01", arrests: 100, detainers: 50 }];
    const mockResponse = { data: mockData, error: null };

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          throwOnError: vi.fn().mockResolvedValue(mockResponse),
        }),
      }),
    } as any);

    const result = await fetchDeportationData();
    expect(result.data).toEqual(mockData);
    expect(result.isStale).toBe(true);
  });

  it("handles errors when fetching data", async () => {
    const mockError = new Error("DB Error");
    const mockResponse = { data: null, error: mockError };

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          throwOnError: vi.fn().mockResolvedValue(mockResponse),
        }),
      }),
    } as any);

    const result = await fetchDeportationData();
    expect(result.data).toEqual([]);
    expect(result.isStale).toBe(true);
  });

  it("updates deportation data successfully", async () => {
    const mockData = {
      date: "2024-01-01",
      arrests: 100,
      detainers: 50,
      image_url: "test.jpg",
    };

    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockReturnValue({
      upsert: upsertMock,
    } as any);

    await updateDeportationData({
      ...mockData,
      imageUrl: mockData.image_url,
    });

    expect(supabase.from).toHaveBeenCalledWith("deportation_data");
    expect(upsertMock).toHaveBeenCalledWith([{ ...mockData }], {
      onConflict: "date",
    });
  });

  it("fetches fresh data and updates database", async () => {
    const mockApiResponse = {
      status: "success",
      data: [{ date: "2024-01-01", arrests: 100, detainers: 50 }],
    };

    vi.mocked(apiModule.fetchLatestData).mockResolvedValue(mockApiResponse);

    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockReturnValue({
      upsert: upsertMock,
    } as any);

    await fetchFreshData();

    expect(apiModule.fetchLatestData).toHaveBeenCalled();
    expect(upsertMock).toHaveBeenCalled();
  });
});

// // Mock the entire PostgrestQueryBuilder
// const mockQueryBuilder = {
//   url: "",
//   headers: {},
//   select: vi.fn().mockReturnThis(),
//   insert: vi.fn().mockReturnThis(),
//   upsert: vi.fn().mockReturnThis(),
//   order: vi.fn().mockReturnThis(),
//   throwOnError: vi.fn().mockReturnThis(),
// } as any;
