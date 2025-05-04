import React, { useEffect, useState, useCallback } from "react";
import PluginManager from "./PluginManager";
import Loader from "./Loader";
import Pagination from "./Pagination";
import FormatSwitcher from "./FormatSwitcher";

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [format, setFormat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [apiUrl, setApiUrl] = useState("http://localhost:8000/api/json");
  const [error, setError] = useState(null);

  const ITEMS_PER_PAGE = 12;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      
      // Use the appropriate plugin's buildUrl method if available
      let url = `${apiUrl}?limit=${ITEMS_PER_PAGE}&skip=${skip}`;
      const pluginByUrl = Object.values(PluginManager.plugins).find(
        plugin => apiUrl.includes(plugin.type.split('/')[1])
      );
      
      if (pluginByUrl && pluginByUrl.buildUrl) {
        url = pluginByUrl.buildUrl(apiUrl, currentPage, ITEMS_PER_PAGE);
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const contentType = response.headers.get("Content-Type");

      const Plugin = PluginManager.getPlugin(contentType);
      if (!Plugin) {
        throw new Error("Unsupported Content-Type: " + contentType);
      }

      const raw = await response.text();
      const result = await Plugin.Component.handleData(raw);

      setFormat(contentType);
      
      // Handle different data structures - the result could be an array or an object with users property
      const items = result.users || result;
      setData(Array.isArray(items) ? items : []);
      
      // Get total count from result, header, or fallback to items length
      const total = result.total || parseInt(response.headers.get("X-Total-Count")) || items.length;
      setTotalItems(total);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Failed to fetch data: ${err.message}`);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // When changing format, reset to first page
  const handleFormatChange = (newApiUrl) => {
    setApiUrl(newApiUrl);
    setCurrentPage(1);
  };

  const Plugin = PluginManager.getPlugin(format);

  return (
    <div>
      <FormatSwitcher 
        currentFormat={apiUrl} 
        onFormatChange={handleFormatChange} 
      />
      
      {isLoading && data.length === 0 ? (
        <Loader />
      ) : error ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          {error}
        </div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          No data available for this format.
        </div>
      ) : (
        <>
          {Plugin && <Plugin.Component data={data} />}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <div style={{ padding: "1rem", textAlign: "center" }}>
            Showing {data.length} out of {totalItems} items (Page {currentPage}{" "}
            of {totalPages})
          </div>
        </>
      )}
    </div>
  );
};

export default DataFetcher;