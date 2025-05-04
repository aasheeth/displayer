import React from "react";

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
    padding: "1rem",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    wordBreak: "break-word",
  },
  key: {
    fontWeight: "bold",
    marginRight: "0.5rem",
  },
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
                <span>{JSON.stringify(value)}</span>
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

    const parsed = lines
      .map((line) => {
        const [idPart, rest] = line.split(": ");
        if (!rest) return null;

        const [name, email] = rest.split(" - ");
        const [firstName, lastName] = name.trim().split(" ");

        return {
          id: parseInt(idPart),
          firstName: firstName || "",
          lastName: lastName || "",
          email: email || "",
        };
      })
      .filter(Boolean); // skip any malformed lines

    return parsed;
  } catch (e) {
    console.error("Failed to parse plain text data:", e);
    return [];
  }
};

export default {
  type: "text/plain",
  Component: StringHandler,
};
