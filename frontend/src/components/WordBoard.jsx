import { useDraggable } from "@dnd-kit/core";

function DraggableWord({ text, id, onDoubleClick }) {
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
    <div
      ref={setNodeRef}
      style={style}
      onDoubleClick={onDoubleClick}
      {...listeners}
      {...attributes}
    >
      {text}
    </div>
  );
}

function WordBoard({ words, onWordDoubleClick }) {
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
        <DraggableWord
          key={index}
          id={word.id}
          text={word.text}
          onDoubleClick={() => onWordDoubleClick(word)}
        />
      ))}
      {/* ➖ Always draggable Line Break */}
      <DraggableWord
        key={words.length}
        id="line-break"
        word="➖ Line Break"
        onDoubleClick={() => onWordDoubleClick({ id: "line-break" })}
      />
    </div>
  );
}

export default WordBoard;
