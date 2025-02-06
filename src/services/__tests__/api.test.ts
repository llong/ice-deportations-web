import { vi, describe, it, expect, beforeEach } from "vitest";
import { fetchLatestData, processImage, fetchDeportationData } from "../api";

// Mock fetch globally
vi.stubGlobal("fetch", vi.fn());

describe("api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches latest data successfully", async () => {
    const mockResponse = { status: "success", data: [] };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await fetchLatestData();
    expect(result).toEqual(mockResponse);
  });

  it("handles errors when fetching data", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));
    await expect(fetchLatestData()).rejects.toThrow("Network error");
  });

  it("processes image successfully", async () => {
    const mockResponse = {
      status: "success",
      data: { text: "processed text" },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await processImage("test-image.jpg");
    expect(result).toEqual(mockResponse);
  });

  it("handles image processing errors", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Processing failed",
      json: () => Promise.resolve({ error: "Processing failed" }),
    } as Response);

    await expect(processImage("test-image.jpg")).rejects.toThrow(
      "Processing failed"
    );
  });

  it("fetches deportation data successfully", async () => {
    const mockData = [{ date: "2024-01-01", arrests: 100, detainers: 50 }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchDeportationData();
    expect(result).toEqual(mockData);
  });

  it("processes image successfully", async () => {
    const mockResult = { arrests: 100, detainers: 50 };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResult),
    });

    const result = await processImage("test.jpg");
    expect(result).toEqual(mockResult);
  });
});
