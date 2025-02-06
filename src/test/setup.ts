import "@testing-library/jest-dom";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Mock Supabase client with real-time functionality
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      throwOnError: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      unsubscribe: vi.fn(),
    }),
  }),
}));

// Mock axios for API tests
vi.mock("axios", () => ({
  default: {
    create: () => ({
      get: vi.fn(),
      post: vi.fn(),
    }),
  },
}));

// Mock fetch for API tests
vi.stubGlobal("fetch", vi.fn());

expect.extend(matchers);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
