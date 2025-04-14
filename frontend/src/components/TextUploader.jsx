import { useState } from 'react';

function TextUploader({ onWordsGenerated }) {
    const [text, setText] = useState("");
  
    function handleSplit() {
      const words = text
          .trim()
          .split(/\s+/) // Split on whitespace
          .map((word) => word.replace(/^[^\w-]+|[^\w-]+$/g, "")) // Trim punctuation
          .filter(Boolean); // Remove empty strings
      onWordsGenerated(words);
    }
  
    return (
      <div>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          cols={60}
          placeholder="Paste text here..."
        />
        <br />
        <button onClick={handleSplit}>Split into Words</button>
      </div>
    );
  }
  
  export default TextUploader;