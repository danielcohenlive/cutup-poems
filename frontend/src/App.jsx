// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { fetchPoems, createPoem } from "./api/poems";
import PoemList from "./components/PoemList";
import PoemEditorWrapper from "./components/PoemEditorWrapper";

function App() {
  const [poems, setPoems] = useState([]);

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
    setPoems((prev) => [...prev, savedPoem]);
  }

  function handleUpdatePoem(updatedPoem) {
    setPoems((prev) =>
      prev.map((poem) => (poem.id === updatedPoem.id ? updatedPoem : poem))
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div style={{ display: "flex" }}>
          <PoemList poems={poems} onNewPoem={handleNewPoem} />
          <div style={{ flex: 1, padding: "2rem" }}>
            <Routes>
              <Route
                path="/poems/:poemId"
                element={<PoemEditorWrapper onUpdatePoem={handleUpdatePoem} />}
              />
              <Route path="/" element={<h1>Select a poem to edit</h1>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
