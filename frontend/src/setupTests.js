import { vi, afterEach } from "vitest";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

// 👇 Automatically mock the poems API
vi.mock("./api/poems", async () => {
  return {
    fetchPoems: vi.fn(),
    fetchPoem: vi.fn(),
    createPoem: vi.fn(),
    updatePoem: vi.fn(),
  };
});

// // 👇 Automatically clean up after each test
// afterEach(() => {
//   vi.clearAllMocks();
//   cleanup();
// });
