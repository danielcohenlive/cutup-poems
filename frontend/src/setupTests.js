import { vi } from "vitest";

// 👇 Automatically mock the poems API
vi.mock("./api/poems", async () => {
  return {
    fetchPoems: vi.fn(),
    fetchPoem: vi.fn(),
    createPoem: vi.fn(),
    updatePoem: vi.fn(),
  };
});
