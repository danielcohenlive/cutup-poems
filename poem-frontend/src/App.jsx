// src/App.jsx
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { fetchPoems, fetchPoem, createPoem, updatePoem } from "./api/poems";
import PoemList from "./components/PoemList";
import PoemEditor from "./components/PoemEditor";

function App() {
  const [poems, setPoems] = useState([]);
  const [activePoem, setActivePoem] = useState(null);

  useEffect(() => {
    async function loadPoems() {
      const data = await fetchPoems();
      setPoems(data);
    }
    loadPoems();
  }, []);

  async function handleNewPoem() {
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
    const savedPoem = await createPoem(newPoem);
    setPoems((prev) => [...prev, newPoem]);
    setActivePoem(savedPoem);
  }

  async function handleSelectPoem(id) {
    const poem = await fetchPoem(id);
    setActivePoem(poem);
  }

  async function handleUpdatePoem(updatedPoem) {
    await updatePoem(updatedPoem.id, updatedPoem);
    setActivePoem(updatedPoem);
    setPoems((prev) =>
      prev.map((poem) =>
        poem.id === updatedPoem.id
          ? {
              ...poem,
              name: updatedPoem.name,
              updated_at: updatedPoem.updated_at,
            }
          : poem
      )
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <PoemList
        poems={poems}
        activePoemId={activePoem?.id}
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
