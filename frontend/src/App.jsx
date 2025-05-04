import React from "react";
import PluginManager from "./components/PluginManager";
import DataFetcher from "./components/DataFetcher";
import JSONHandler from "./components/JSONHandler";
import XMLHandler from "./components/XMLHandler";
import StringHandler from "./components/StringHandler";
import FormatSwitcher from "./components/FormatSwitcher";
import "./App.css";
PluginManager.registerPlugin(JSONHandler.type, JSONHandler);
PluginManager.registerPlugin(XMLHandler.type, XMLHandler);
PluginManager.registerPlugin(StringHandler.type, StringHandler);

const App = () => {
  return (
    <div className="App">
      <header style={{ marginBottom: "2rem" }}>
        <h1>Data Fetcher Application</h1>
        <p>
          A plugin-based application that can display data in different formats: JSON, XML, and plain text
        </p>
      </header>
      
      <main>
        <DataFetcher />
      </main>
      
      <footer style={{ marginTop: "2rem", fontSize: "0.8rem", opacity: 0.7 }}>
        <p>
          Data Fetcher Application - Powered by React &amp; Plugin Architecture
        </p>
      </footer>
    </div>
  );
};

export default App;