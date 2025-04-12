// src/components/PoemEditor.jsx
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import TextUploader from "./TextUploader";
import WordBoard from "./WordBoard";
import PoemCanvas from "./PoemCanvas";

function PoemEditor({ poem, onUpdatePoem }) {
  function handleWordsGenerated(newWords) {
    const updatedAvailableWords = [
      ...poem.available_words,
      ...newWords.map((word) => ({ id: nanoid(), text: word })),
    ];

    onUpdatePoem({
      ...poem,
      available_words: updatedAvailableWords,
      updated_at: new Date().toISOString(),
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (over.id === "poem-canvas") {
      // Dragging from WordBoard to PoemCanvas
      const index = parseInt(active.id.split("-")[1], 10);
      const word = poem.available_words[index];

      onUpdatePoem({
        ...poem,
        available_words: poem.available_words.filter((_, idx) => idx !== index),
        words: [...poem.words, { id: nanoid(), text: word.text }],
        updated_at: new Date().toISOString(),
      });
    } else if (
      poem.words.find((w) => w.id === active.id) &&
      poem.words.find((w) => w.id === over.id)
    ) {
      // Reordering inside PoemCanvas
      const oldIndex = poem.words.findIndex((w) => w.id === active.id);
      const newIndex = poem.words.findIndex((w) => w.id === over.id);

      if (oldIndex !== newIndex) {
        onUpdatePoem({
          ...poem,
          words: arrayMove(poem.words, oldIndex, newIndex),
          updated_at: new Date().toISOString(),
        });
      }
    }
  }

  return (
    <>
      {poem ? (
        <DndContext onDragEnd={handleDragEnd}>
          <div style={{ padding: "2rem" }}>
            <h1>Cutup Poetry Maker</h1>

            <TextUploader onWordsGenerated={handleWordsGenerated} />

            <h2>Word Bank</h2>
            <WordBoard words={poem.available_words} />

            <h2>Your Poem</h2>
            <PoemCanvas poemWords={poem.words} />
          </div>
        </DndContext>
      ) : (
        <h1>Select a poem to edit</h1>
      )}
    </>
  );
}

export default PoemEditor;
