import TextUploader from "./components/TextUploader";
import WordBoard from "./components/WordBoard";
import PoemCanvas from "./components/PoemCanvas";
import PoemList from "./components/PoemList";
import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";

function App() {
  const [poems, setPoems] = useState([]);
  const [activePoemId, setActivePoemId] = useState([]);
  let activePoem;
  activePoem = poems.find((p) => p.id === activePoemId);
  function handleWordsGenerated(newWords) {
    if (!activePoemId) return; // No active poem selected

    setPoems((prevPoems) =>
      prevPoems.map((poem) => {
        if (poem.id !== activePoemId) return poem;

        const newAvailableWords = [
          ...poem.available_words,
          ...newWords.map((word) => ({ id: nanoid(), text: word })),
        ];

        return {
          ...poem,
          available_words: newAvailableWords,
          // updated_at: new Date().toISOString(),
        };
      })
    );
  }
  function handleDragEnd(event) {
    const { over, active } = event;

    if (!over || !activePoemId) return;

    setPoems((prevPoems) =>
      prevPoems.map((poem) => {
        if (poem.id !== activePoemId) return poem;
        if (over && over.id === "poem-canvas") {
          const wordId = active.id; // e.g., "word-5"
          const index = parseInt(wordId.split("-")[1], 10);
          const word = activePoem.available_words[index];
          return {
            ...poem,
            available_words: poem.available_words.filter(
              (_, idx) => idx !== index
            ),
            words: [...poem.words, { id: nanoid(), text: word.text }],
            updated_at: new Date().toISOString(),
          };
        } else if (
          activePoem.words.find((w) => w.id === active.id) &&
          activePoem.words.find((w) => w.id === over.id)
        ) {
          // Reordering inside PoemCanvas
          const oldIndex = activePoem.words.findIndex(
            (word) => word.id === active.id
          );
          const newIndex = activePoem.words.findIndex(
            (word) => word.id === over.id
          );

          if (oldIndex !== newIndex) {
            return {
              ...poem,
              words: arrayMove(poem.words, oldIndex, newIndex),
              updated_at: new Date().toISOString(),
            };
          }
        }

        return poem;
      })
    );
  }
  function handleNewPoem() {
    const id = nanoid();
    const now = new Date().toISOString();
    const newPoem = {
      id,
      name: `Untitled Poem ${poems.length + 1}`,
      created_at: now,
      updated_at: now,
      available_words: [],
      words: [],
    };
    setPoems((prev) => [...prev, newPoem]);
    setActivePoemId(id);
  }

  function handleSelectPoem(id) {
    setActivePoemId(id);
  }
  return (
    <div style={{ display: "flex" }}>
      <PoemList
        poems={poems}
        activePoemId={activePoemId}
        onSelectPoem={handleSelectPoem}
        onNewPoem={handleNewPoem}
      />
      <div style={{ flex: 1, padding: "2rem" }}>
        {activePoem ? (
          <DndContext onDragEnd={handleDragEnd}>
            <div style={{ padding: "2rem" }}>
              <h1>Cutup Poetry Maker</h1>

              <TextUploader onWordsGenerated={handleWordsGenerated} />

              <h2>Word Bank</h2>
              <WordBoard words={activePoem.available_words} />

              <h2>Your Poem</h2>
              <PoemCanvas poemWords={activePoem.words} />

              {/* <CopyButton words={poemWords} /> */}
            </div>
          </DndContext>
        ) : (
          <h1>Select a poem to edit</h1>
        )}
      </div>
    </div>
  );
}

export default App;
