// src/components/PoemEditor.jsx
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { useState } from "react";
import TextUploader from "./TextUploader";
import WordBoard from "./WordBoard";
import PoemCanvas from "./PoemCanvas";

function PoemEditor({ poem, onUpdatePoem }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(poem?.name || "");
  function handleTitleClick() {
    setIsEditingTitle(true);
    setTempTitle(poem.name);
  }

  function handleTitleChange(e) {
    setTempTitle(e.target.value);
  }

  function handleTitleBlur() {
    saveTitle();
  }

  function handleTitleKeyDown(e) {
    if (e.key === "Enter") {
      saveTitle();
    }
    if (e.key === "Escape") {
      cancelEdit();
    }
  }

  function saveTitle() {
    setIsEditingTitle(false);
    if (tempTitle.trim() && tempTitle !== poem.name) {
      const updatedPoem = {
        ...poem,
        name: tempTitle.trim(),
        updated_at: new Date().toISOString(),
      };
      onUpdatePoem(updatedPoem);
    }
  }

  function cancelEdit() {
    setIsEditingTitle(false);
    setTempTitle(poem.name);
  }

  function handleWordsGenerated(newWords) {
    const updatedAvailableWords = [
      ...poem.available_words,
      ...newWords.map((word) => ({
        id: nanoid(),
        text: word,
        kind: "available",
      })),
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
      moveWordToPoem(active);
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

  function handleWordBankDoubleClick(word) {
    moveWordToPoem(word);
  }

  function moveWordToPoem(word) {
    console.log(word);
    if (word.id === "line-break") {
      // Insert a new line break
      const newWord = {
        id: nanoid(),
        text: "⏎",
        kind: "newline",
      };

      const updatedWords = [...poem.words, newWord];

      const updatedPoem = {
        ...poem,
        words: updatedWords,
        updated_at: new Date().toISOString(),
      };

      onUpdatePoem(updatedPoem);
    } else {
      // Double click will have the full word object, drag will only have the id
      word = word.text
        ? word
        : poem.available_words.find((w) => w.id === word.id);
      onUpdatePoem({
        ...poem,
        available_words: poem.available_words.filter(
          (w, _) => w.id !== word.id
        ),
        words: [...poem.words, { id: nanoid(), text: word.text, kind: "poem" }],
        updated_at: new Date().toISOString(),
      });
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {isEditingTitle ? (
        <input
          type="text"
          data-testid="poem-title-input"
          value={tempTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          autoFocus
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            width: "100%",
            marginBottom: "1rem",
          }}
        />
      ) : (
        <h1
          onClick={handleTitleClick}
          style={{
            cursor: "pointer",
            fontSize: "2rem",
            marginBottom: "1rem",
          }}
          data-testid="poem-title"
          title="Click to rename poem"
        >
          {poem.name}
        </h1>
      )}

      <TextUploader onWordsGenerated={handleWordsGenerated} />

      <h2>Word Bank</h2>
      <WordBoard
        words={poem.available_words}
        onWordDoubleClick={handleWordBankDoubleClick}
      />

      <h2>Your Poem</h2>
      <PoemCanvas poemWords={poem.words} />
    </DndContext>
  );
}

export default PoemEditor;
