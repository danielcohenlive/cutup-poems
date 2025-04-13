import { useNavigate, useLocation } from "react-router-dom";

function PoemList({ poems, onNewPoem }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activePoemId = location.pathname.startsWith("/poems/")
    ? location.pathname.split("/poems/")[1]
    : null;
  return (
    <div
      style={{
        width: "200px",
        borderRight: "1px solid lightgray",
        padding: "1rem",
      }}
    >
      <h3>Poems</h3>
      <button onClick={onNewPoem} style={{ marginBottom: "1rem" }}>
        New Poem
      </button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {poems.map((poem) => (
          <li
            key={poem.id}
            onClick={() => navigate(`/poems/${poem.id}`)}
            style={{
              cursor: "pointer",
              fontWeight: poem.id === activePoemId ? "bold" : "normal",
              marginBottom: "0.5rem",
            }}
          >
            {poem.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PoemList;
