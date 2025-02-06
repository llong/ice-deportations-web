import "@testing-library/jest-dom";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { mockDeportationData } from "./test-utils";

const supabaseResponse = Promise.resolve({
  data: mockDeportationData,
  error: null,
});

const orderMock = () => ({
  ...supabaseResponse,
  throwOnError: () => supabaseResponse,
});

const selectMock = () => ({
  order: orderMock,
  throwOnError: () => supabaseResponse,
});

// Mock Supabase client
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: selectMock,
      upsert: () => Promise.resolve({ error: null }),
    }),
    channel: () => ({
      on: () => ({
        subscribe: () => ({
          unsubscribe: vi.fn(),
        }),
      }),
    }),
  }),
}));

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
