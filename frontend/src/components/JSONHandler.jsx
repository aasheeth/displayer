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

const JSONHandler = ({ data }) => {
  return (
    <div>
      <h3 style={{ paddingLeft: "1rem" }}>JSON Data (as Cards):</h3>
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

JSONHandler.handleData = async (data) => {
  return JSON.parse(data);
};

export default {
  type: "application/json",
  Component: JSONHandler,
  buildUrl: (baseUrl, currentPage, itemsPerPage) => {
    const skip = (currentPage - 1) * itemsPerPage;
    return `${baseUrl}?limit=${itemsPerPage}&skip=${skip}`;
  },
};
