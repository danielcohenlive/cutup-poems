import { useDraggable } from "@dnd-kit/core";

function DraggableWord({ word, id }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    padding: "5px 10px",
    border: "1px solid gray",
    borderRadius: "4px",
    // background: "white",
    cursor: "grab",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {word}
    </div>
  );
}

function WordBoard({ words }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "2rem",
      }}
    >
      {words.map((word, index) => (
        <DraggableWord key={index} id={`word-${index}`} word={word.text} />
      ))}
    </div>
  );
}

export default WordBoard;
