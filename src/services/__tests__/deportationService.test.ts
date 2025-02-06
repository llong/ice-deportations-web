import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  fetchDeportationData,
  updateDeportationData,
  fetchFreshData,
} from "../deportationService";
import { supabase } from "../../lib/supabase";
import * as api from "../api";

// Mock Supabase
vi.mock("../../lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock API
vi.mock("../api", () => ({
  fetchLatestData: vi.fn(),
}));

describe("deportationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches deportation data successfully", async () => {
    const mockData = [{ date: "2024-01-01", arrests: 100, detainers: 50 }];
    const mockResponse = { data: mockData, error: null };

    const order = vi.fn().mockResolvedValue(mockResponse);
    const select = vi.fn().mockReturnValue({ order });

    vi.mocked(supabase.from).mockReturnValue({
      select,
    } as any);

    const result = await fetchDeportationData();
    expect(result.data).toEqual(mockData);
    expect(result.isStale).toBe(true);
  });

  it("handles errors when fetching data", async () => {
    const mockError = new Error("DB Error");
    const mockResponse = { data: null, error: mockError };

    const mockSelect = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockReturnValue({
      throwOnError: vi.fn().mockResolvedValue(mockResponse),
    });

    const mockFrom = vi.fn().mockReturnValue({
      select: mockSelect,
      order: mockOrder,
    });

    vi.mocked(supabase.from).mockImplementation(mockFrom);

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

    const upsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockReturnValue({
      upsert,
    } as any);

    await updateDeportationData({
      ...mockData,
      imageUrl: mockData.image_url,
    });

    expect(supabase.from).toHaveBeenCalledWith("deportation_data");
    expect(upsert).toHaveBeenCalledWith(
      {
        date: mockData.date,
        arrests: mockData.arrests,
        detainers: mockData.detainers,
        image_url: mockData.image_url,
      },
      {
        onConflict: "date",
      }
    );
  });

  it("fetches fresh data and updates database", async () => {
    const mockApiResponse = {
      status: "success",
      data: [
        {
          date: "2024-01-01",
          arrests: 100,
          detainers: 50,
        },
      ],
    };

    vi.mocked(api.fetchLatestData).mockResolvedValue(mockApiResponse);

    const upsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockReturnValue({
      upsert,
    } as any);

    await fetchFreshData();

    expect(api.fetchLatestData).toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledWith(
      {
        date: mockApiResponse.data[0].date,
        arrests: mockApiResponse.data[0].arrests,
        detainers: mockApiResponse.data[0].detainers,
      },
      {
        onConflict: "date",
      }
    );
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
