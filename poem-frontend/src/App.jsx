// src/App.jsx
import { useState } from "react";
import { nanoid } from "nanoid";
import PoemList from "./components/PoemList";
import PoemEditor from "./components/PoemEditor";

function App() {
  const [poems, setPoems] = useState([]);
  const [activePoemId, setActivePoemId] = useState(null);

  const activePoem = poems.find((p) => p.id === activePoemId);

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

  function handleUpdatePoem(updatedPoem) {
    setPoems((prevPoems) =>
      prevPoems.map((poem) => (poem.id === updatedPoem.id ? updatedPoem : poem))
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <PoemList
        poems={poems}
        activePoemId={activePoemId}
        onSelectPoem={handleSelectPoem}
        onNewPoem={handleNewPoem}
      />
      <div style={{ flex: 1 }}>
        <PoemEditor poem={activePoem} onUpdatePoem={handleUpdatePoem} />
      </div>
    </div>
  );
}

export default App;
