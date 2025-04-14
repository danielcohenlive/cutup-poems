import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import App from "../App"; // adjust if your App.jsx path is different
import * as api from "../api/poems"; // <<-- this is how you import the flat API functions
import PoemEditor from "../components/PoemEditor";

describe("PoemEditor", () => {
  it("removes new lines on double click", async () => {
    const fakePoem = {
      id: "poem-123",
      name: "Untitled Poem 1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      available_words: [],
      words: [
        { id: "word-1", text: "foo", kind: "poem" },
        { id: "word-2", text: "(new line)", kind: "newline" },
      ],
    };

    const user = userEvent.setup();

    const fakeUpdatePoem = vi.fn();

    render(<PoemEditor poem={fakePoem} onUpdatePoem={fakeUpdatePoem} />);
    const newLine = screen.getByText("(new line)");

    await user.dblClick(newLine);
    expect(fakeUpdatePoem).toHaveBeenCalledWith({
      ...fakePoem,
      updated_at: expect.any(String),
      words: [{ id: "word-1", text: "foo", kind: "poem" }],
    });
  });
  it("returns words to wordboard on double click", async () => {
    const fakePoem = {
      id: "poem-123",
      name: "Untitled Poem 1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      available_words: [],
      words: [
        { id: "word-1", text: "foo word", kind: "poem" },
        { id: "word-2", text: "(new line)", kind: "newline" },
      ],
    };

    const user = userEvent.setup();

    const fakeUpdatePoem = vi.fn();

    render(<PoemEditor poem={fakePoem} onUpdatePoem={fakeUpdatePoem} />);
    const fooWord = screen.getByText("foo word");

    await user.dblClick(fooWord);
    expect(fakeUpdatePoem).toHaveBeenCalledWith({
      ...fakePoem,
      updated_at: expect.any(String),
      available_words: [{ id: "word-1", text: "foo word", kind: "available" }],
      words: [{ id: "word-2", text: "(new line)", kind: "newline" }],
    });
  });
  it("adds words to poem on double click", async () => {
    const fakePoem = {
      id: "poem-123",
      name: "Untitled Poem 1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      available_words: [{ id: "word-1", text: "foo word", kind: "available" }],
      words: [{ id: "word-2", text: "bar word", kind: "poem" }],
    };

    const user = userEvent.setup();

    const fakeUpdatePoem = vi.fn();

    render(<PoemEditor poem={fakePoem} onUpdatePoem={fakeUpdatePoem} />);
    const fooWord = screen.getByText("foo word");

    await user.dblClick(fooWord);
    expect(fakeUpdatePoem).toHaveBeenCalledWith({
      ...fakePoem,
      updated_at: expect.any(String),
      available_words: [],
      words: [
        { id: "word-2", text: "bar word", kind: "poem" },
        { id: "word-1", text: "foo word", kind: "poem" },
      ],
    });
  });
});
