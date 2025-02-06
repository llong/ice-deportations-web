import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  fetchLatestData,
  processImage,
  fetchDeportationData,
  api,
} from "../api";

vi.mock("axios", () => ({
  default: {
    create: () => ({
      get: vi.fn(),
      post: vi.fn(),
    }),
  },
}));

describe("api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches latest data successfully", async () => {
    const mockResponse = { status: "success", data: [] };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchLatestData();
    expect(result).toEqual(mockResponse);
  });

  it("handles errors when fetching data", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));
    await expect(fetchLatestData()).rejects.toThrow("Network error");
  });

  it("processes image successfully", async () => {
    const mockResult = { arrests: 100, detainers: 50 };

    vi.spyOn(api, "post").mockResolvedValueOnce({
      data: mockResult,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    });

    const result = await processImage("test.jpg");
    expect(result).toEqual(mockResult);
  });

  it("handles image processing errors", async () => {
    vi.spyOn(api, "post").mockRejectedValueOnce(new Error("Network error"));

    const result = await processImage("test.jpg");
    expect(result).toBeNull();
  });

  it("fetches deportation data successfully", async () => {
    const mockData = [{ date: "2024-01-01", arrests: 100, detainers: 50 }];
    vi.spyOn(api, "get").mockResolvedValueOnce({ data: mockData });

    const result = await fetchDeportationData();
    expect(result).toEqual(mockData);
  });
});
