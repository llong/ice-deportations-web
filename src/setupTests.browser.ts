import "@testing-library/jest-dom";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Mock process.env
vi.stubGlobal("process", {
  ...process,
  env: {
    ...process.env,
    NODE_ENV: "test",
  },
});

expect.extend(matchers);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
