import TextUploader from "./components/TextUploader";
import WordBoard from "./components/WordBoard";
import PoemCanvas from "./components/PoemCanvas";
import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";

function App() {
  const [availableWords, setAvailableWords] = useState([]);
  const [poemWords, setPoemWords] = useState([]);
  function handleWordsGenerated(words) {
    setAvailableWords((prevWords) => [...prevWords, ...words]);
  }
  function handleDragEnd(event) {
    const { over, active } = event;

    if (over && over.id === "poem-canvas") {
      const wordId = active.id; // e.g., "word-5"
      const index = parseInt(wordId.split("-")[1], 10);
      const word = availableWords[index];
      setPoemWords((prev) => [...prev, { id: nanoid(), text: word }]);
    } else if (
      poemWords.find((w) => w.id === active.id) &&
      poemWords.find((w) => w.id === over.id)
    ) {
      // Reordering inside PoemCanvas
      const oldIndex = poemWords.findIndex((word) => word.id === active.id);
      const newIndex = poemWords.findIndex((word) => word.id === over.id);

      if (oldIndex !== newIndex) {
        setPoemWords((items) => arrayMove(items, oldIndex, newIndex));
      }
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ padding: "2rem" }}>
        <h1>Cutup Poetry Maker</h1>

        <TextUploader onWordsGenerated={handleWordsGenerated} />

        <h2>Word Bank</h2>
        <WordBoard words={availableWords} />

        <h2>Your Poem</h2>
        <PoemCanvas poemWords={poemWords} />

        {/* <CopyButton words={poemWords} /> */}
      </div>
    </DndContext>
  );
}

export default App;
