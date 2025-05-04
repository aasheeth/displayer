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

const XMLHandler = ({ data }) => {
  return (
    <div>
      <h3 style={{ paddingLeft: "1rem" }}>XML Data (as Cards):</h3>
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

XMLHandler.handleData = async (data) => {
  try {
    console.log("Raw XML data:", data.substring(0, 100) + "...");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");

    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
      console.error("XML parsing error:", parseError[0].textContent);
      throw new Error("Failed to parse XML data");
    }

    let total = 0;
    const metaElement = xmlDoc.querySelector("response > meta");
    if (metaElement) {
      const totalElement = metaElement.querySelector("total");
      if (totalElement) {
        total = parseInt(totalElement.textContent, 10) || 0;
      }
    }

    let userElements = xmlDoc.querySelectorAll("response > users > user");

    if (userElements.length === 0) {
      userElements = xmlDoc.querySelectorAll("user");
    }

    if (userElements.length === 0) {
      userElements = xmlDoc.querySelectorAll("item");
    }

    if (
      userElements.length === 0 ||
      (userElements.length === 1 && userElements[0].textContent.includes("{"))
    ) {
      console.log("Trying to parse potential JSON inside XML");
      const allElements = xmlDoc.getElementsByTagName("*");
      const jsonData = [];

      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        const content = element.textContent.trim();

        if (content.startsWith("{") && content.endsWith("}")) {
          try {
            const parsed = JSON.parse(content);
            if (parsed && typeof parsed === "object") {
              jsonData.push(parsed);
            }
          } catch (e) {
            // Ignore invalid JSON
          }
        }
      }

      if (jsonData.length > 0) {
        console.log("Successfully parsed JSON from XML content:", jsonData);
        return jsonData;
      }
    }

    const usersArray = Array.from(userElements).map((userNode) => {
      if (userNode.tagName === "item" && userNode.textContent.includes("{")) {
        try {
          const jsonMatch = userNode.textContent.match(/\{.*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.warn("Failed to parse JSON from item node:", e);
        }
      }

      const userData = {};

      Array.from(userNode.children).forEach((prop) => {
        const propName = prop.tagName;

        if (prop.children.length > 0 && !prop.children[0].tagName) {
          userData[propName] = prop.textContent.trim();
        } else if (prop.children.length > 0) {
          userData[propName] = {};
          Array.from(prop.children).forEach((subProp) => {
            userData[propName][subProp.tagName] = subProp.textContent.trim();
          });
        } else {
          userData[propName] = prop.textContent.trim();
        }
      });

      return userData;
    });

    console.log("Processed XML data:", usersArray);
    return usersArray.length > 0 ? (total ? { users: usersArray, total } : usersArray) : [];
  } catch (error) {
    console.error("XML handler error:", error);
    return [];
  }
};

export default {
  type: "application/xml",
  Component: XMLHandler,
  buildUrl: (baseUrl, currentPage, itemsPerPage) => {
    const skip = (currentPage - 1) * itemsPerPage;
    return `${baseUrl}?limit=${itemsPerPage}&skip=${skip}`;
  },
};
