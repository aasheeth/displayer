import React from "react";

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
    padding: "1rem",
  },
  card: {
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    backgroundColor: "#333",
    color: "#fff",
    wordBreak: "break-word",
  },
  key: {
    fontWeight: "bold",
    marginRight: "0.5rem",
    color: "#61dafb",
  },
  value: {
    color: "#fff",
  }
};

const StringHandler = ({ data }) => {
  return (
    <div>
      <h3 style={{ paddingLeft: "1rem" }}>String Data (Parsed as Cards):</h3>
      <div style={styles.container}>
        {data.map((item, idx) => (
          <div key={idx} style={styles.card}>
            {Object.entries(item).map(([key, value]) => (
              <div key={key}>
                <span style={styles.key}>{key}:</span>
                <span style={styles.value}>
                  {typeof value === 'object' 
                    ? JSON.stringify(value) 
                    : String(value)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

StringHandler.handleData = async (data) => {
  try {
    const lines = data.trim().split("\n");
    let totalItems = 0;
    let startLine = 0;
    if (lines[0] && lines[0].startsWith("Total:")) {
      const totalMatch = lines[0].match(/Total:\s*(\d+)/);
      if (totalMatch && totalMatch[1]) {
        totalItems = parseInt(totalMatch[1], 10);
        startLine = 1; 
      }
    }
    const parsed = lines
      .slice(startLine)
      .map((line, index) => {
        line = line.trim();
        if (!line) return null;
        const formatOne = line.match(/^(\d+):\s*(.*?)\s*-\s*(.*)$/);
        if (formatOne) {
          const [_, id, name, email] = formatOne;
          const [firstName, ...lastNameParts] = name.trim().split(" ");
          const lastName = lastNameParts.join(" ");
          
          return {
            id: parseInt(id, 10),
            firstName: firstName || "",
            lastName: lastName || "",
            email: email.trim() || "",
          };
        }
        const formatTwo = line.match(/^(.*?)\s*\((.*?)\)\s*-\s*(\d+)$/);
        if (formatTwo) {
          const [_, name, email, id] = formatTwo;
          const [firstName, ...lastNameParts] = name.trim().split(" ");
          const lastName = lastNameParts.join(" ");
          
          return {
            id: parseInt(id, 10),
            firstName: firstName || "",
            lastName: lastName || "",
            email: email.trim() || "",
          };
        }
        const parts = line.split(/[:-]/).map(p => p.trim());
        
        return {
          id: parseInt(parts[0], 10) || index + 1,
          content: line,
        };
      })
      .filter(Boolean); 
    return totalItems ? { users: parsed, total: totalItems } : parsed;
  } catch (e) {
    console.error("Failed to parse plain text data:", e);
    return [];
  }
};

export default {
  type: "text/plain",
  Component: StringHandler,
  buildUrl: (baseUrl, currentPage, itemsPerPage) => {
    const skip = (currentPage - 1) * itemsPerPage;
    return `${baseUrl}?limit=${itemsPerPage}&skip=${skip}`;
  },
};