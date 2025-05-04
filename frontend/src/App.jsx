import React from "react";
import PluginManager from "./components/PluginManager";
import DataFetcher from "./components/DataFetcher";
import JSONHandler from "./components/JSONHandler";
import XMLHandler from "./components/XMLHandler";
import StringHandler from "./components/StringHandler";

PluginManager.registerPlugin(JSONHandler.type, JSONHandler);
PluginManager.registerPlugin(XMLHandler.type, XMLHandler);
PluginManager.registerPlugin(StringHandler.type, StringHandler);

const App = () => (
  <div className="App">
    <h1>Data Fetcher Application</h1>
    <DataFetcher />
  </div>
);

export default App;
