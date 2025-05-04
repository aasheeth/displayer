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

JSONHandler.handleData = async (data) => {
  try {
    const parsed = JSON.parse(data);
    
    // Handle different response formats
    let users = [];
    let total = 0;
    
    // Case 1: Array of users
    if (Array.isArray(parsed)) {
      users = parsed;
      total = parsed.length;
    } 
    // Case 2: Object with users array
    else if (parsed.users && Array.isArray(parsed.users)) {
      users = parsed.users;
      total = parsed.total || parsed.users.length;
    }
    // Case 3: Object with data in another property
    else if (parsed.data && Array.isArray(parsed.data)) {
      users = parsed.data;
      total = parsed.total || parsed.count || parsed.data.length;
    }
    // Case 4: Object is a single user
    else if (typeof parsed === 'object' && parsed !== null) {
      users = [parsed];
      total = 1;
    }
    
    return { 
      users: users, 
      total: total || users.length 
    };
  } catch (e) {
    console.error("Failed to parse JSON data:", e);
    return [];
  }
};

export default {
  type: "application/json",
  Component: JSONHandler,
  buildUrl: (baseUrl, currentPage, itemsPerPage) => {
    const skip = (currentPage - 1) * itemsPerPage;
    return `${baseUrl}?limit=${itemsPerPage}&skip=${skip}`;
  },
};