// src/components/PoemCanvas.jsx
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableWord({ id, word }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    padding: "5px 10px",
    margin: "5px",
    border: "1px solid gray",
    borderRadius: "4px",
    cursor: "grab",
    transform: CSS.Transform.toString(transform),
    transition,
    display: "inline-block",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {word}
    </div>
  );
}

function PoemCanvas({ poemWords }) {
  const { setNodeRef } = useDroppable({
    id: "poem-canvas",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: "100px",
        border: "2px dashed gray",
        padding: "1rem",
        marginBottom: "2rem",
      }}
    >
      {poemWords.length === 0 ? (
        <p style={{ color: "gray" }}>Drag words here to build your poem...</p>
      ) : (
        <SortableContext items={poemWords.map((word) => word.id)}>
          {poemWords.map((word, index) => (
            <SortableWord key={word.id} id={word.id} word={word.text} />
          ))}
        </SortableContext>
      )}
    </div>
  );
}

export default PoemCanvas;
