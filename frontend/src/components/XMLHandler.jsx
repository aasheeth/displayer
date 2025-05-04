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
    
    // Check for parsing errors
    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
      console.error("XML parsing error:", parseError[0].textContent);
      throw new Error("Failed to parse XML data");
    }
    
    // First, let's handle the case if it's nested within response->users->user structure
    let users = [];
    const responseElement = xmlDoc.getElementsByTagName("response")[0];
    
    if (responseElement) {
      const usersElement = responseElement.getElementsByTagName("users")[0];
      if (usersElement) {
        // Try to get individual user elements
        const userElements = usersElement.getElementsByTagName("user");
        if (userElements && userElements.length > 0) {
          // Convert NodeList to Array
          users = Array.from(userElements);
        } else {
          // Handle case where 'user' might be an array directly in 'users'
          try {
            // In this backend structure, we might have users as an array in array format
            const userArray = JSON.parse(usersElement.textContent);
            if (Array.isArray(userArray)) {
              return userArray; // Return the parsed array directly
            }
          } catch (e) {
            console.warn("Failed to parse users content as JSON:", e);
          }
        }
      }
    }
    
    // If no users were found via the response->users->user path, try direct approach
    if (users.length === 0) {
      users = Array.from(xmlDoc.getElementsByTagName("user"));
    }
    
    // Still no users? Try finding any elements with reasonable user data
    if (users.length === 0) {
      // Look for common user data patterns in any elements
      const allElements = xmlDoc.getElementsByTagName("*");
      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        // If element has children with names like id, firstName, email, etc.
        const childElements = element.children;
        let isUserLike = false;
        
        for (let j = 0; j < childElements.length; j++) {
          const childName = childElements[j].tagName.toLowerCase();
          if (['id', 'firstname', 'lastname', 'email', 'username'].includes(childName)) {
            isUserLike = true;
            break;
          }
        }
        
        if (isUserLike) {
          users.push(element);
        }
      }
    }
    
    // Extract metadata if available
    let total = 0;
    const metaElement = xmlDoc.getElementsByTagName("meta")[0];
    if (metaElement) {
      const totalElement = metaElement.getElementsByTagName("total")[0];
      if (totalElement) {
        total = parseInt(totalElement.textContent, 10) || 0;
      }
    }
    
    // Map XML nodes to objects
    const result = users.map((userNode) => {
      const obj = {};
      // Get id from attribute if present
      const id = userNode.getAttribute("id");
      if (id) obj.id = id;
      
      Array.from(userNode.children).forEach((child) => {
        obj[child.tagName] = child.textContent;
      });
      return obj;
    });
    
    console.log("Processed XML data:", result);
    
    // Return with total if available
    return result.length > 0 ? (total ? { users: result, total } : result) : [];
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