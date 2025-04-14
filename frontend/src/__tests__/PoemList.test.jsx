import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import App from "../App"; // adjust if your App.jsx path is different
import * as api from "../api/poems"; // <<-- this is how you import the flat API functions

describe("PoemList", () => {
  describe("Poem title editing", () => {
    it("updates the title in the sidebar after editing", async () => {
      const user = userEvent.setup();

      const fakePoem = {
        id: "poem-123",
        name: "Untitled Poem 1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        available_words: [],
        words: [],
      };

      // Setup mocked responses
      api.fetchPoems.mockResolvedValue([fakePoem]);
      api.fetchPoem.mockResolvedValue(fakePoem);
      api.updatePoem.mockImplementation((id, poem) => Promise.resolve(poem));

      render(<App />);

      // Wait for the initial poems to load (you might need a wait or mock backend later)
      // For now, let's assume there's already one poem visible in the sidebar

      // Click on the first poem in the sidebar
      const poemLink = await screen.findByText(/Untitled Poem/i); // or whatever your default name is
      await user.click(poemLink);

      // The editor should open
      const title = await screen.findByRole("heading", { level: 1 });

      // Double click (or click depending on your setup) to start editing
      await user.click(title);

      // Now there should be an input field
      const input = screen.getByTestId("poem-title-input");
      await user.clear(input);
      await user.type(input, "My New Title{enter}");

      const poemTitle = screen.getByTestId("poem-title");
      expect(poemTitle.textContent).toBe("My New Title");

      const poemList = await screen.findByTestId("poem-list");
      await within(poemList).findByText("My New Title");
    });
  });
});
