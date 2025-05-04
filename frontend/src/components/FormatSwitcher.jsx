import React from "react";

const FormatSwitcher = ({ currentFormat, onFormatChange }) => {
  const formats = [
    { id: "json", label: "JSON", url: "http://localhost:8000/api/json" },
    { id: "xml", label: "XML", url: "http://localhost:8000/api/xml" },
    { id: "text", label: "Plain Text", url: "http://localhost:8000/api/text" }
  ];

  return (
    <div style={{ marginBottom: "1rem", textAlign: "center" }}>
      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
        {formats.map((format) => (
          <button
            key={format.id}
            style={{
              backgroundColor: currentFormat === format.url ? "#007bff" : "#e0e0e0",
              color: currentFormat === format.url ? "#fff" : "#000",
            }}
            onClick={() => onFormatChange(format.url)}
          >
            {format.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormatSwitcher;