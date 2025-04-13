import { useParams } from "react-router-dom"; // Read poemId from URL
import { useState, useEffect } from "react"; // Manage local state and side effects
import PoemEditor from "./PoemEditor";
import { fetchPoem, updatePoem } from "../api/poems"; // Fetch poem data from the API

function PoemEditorWrapper() {
  const { poemId } = useParams();
  const [poem, setPoem] = useState(null);

  useEffect(() => {
    async function loadPoem() {
      if (poemId) {
        const data = await fetchPoem(poemId);
        setPoem(data);
      }
    }
    loadPoem();
  }, [poemId]);

  async function handleUpdatePoem(updatedPoem) {
    await updatePoem(updatedPoem.id, updatedPoem);
    setPoem(updatedPoem);
  }

  return (
    <>
      {poem ? (
        <PoemEditor poem={poem} onUpdatePoem={handleUpdatePoem} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default PoemEditorWrapper;
