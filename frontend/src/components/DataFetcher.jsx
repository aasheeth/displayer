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
      const contentType = apiUrl.includes('json') ? 'application/json' : 
                          apiUrl.includes('xml') ? 'application/xml' : 
                          'text/plain';
      
      const Plugin = PluginManager.getPlugin(contentType);
      let url;
      if (Plugin && Plugin.buildUrl) {
        url = Plugin.buildUrl(apiUrl, currentPage, ITEMS_PER_PAGE);
      } else {
        url = `${apiUrl}?limit=${ITEMS_PER_PAGE}&skip=${skip}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const responseContentType = response.headers.get("Content-Type") || contentType;

      if (!Plugin) {
        throw new Error("Unsupported Content-Type: " + responseContentType);
      }

      const raw = await response.text();
      const result = await Plugin.Component.handleData(raw);

      setFormat(responseContentType);
      const items = result.users || result;
      setData(Array.isArray(items) ? items : []);
      const total = result.total || parseInt(response.headers.get("X-Total-Count")) || (Array.isArray(items) ? items.length : 0);
      setTotalItems(total);
      const calculatedPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
      setTotalPages(calculatedPages);
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
        <div className="error-message">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          No data available for this format.
        </div>
      ) : (
        <>
          {Plugin && <Plugin.Component data={data} />}
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
          
          <div style={{ padding: "1rem", textAlign: "center" }}>
            Showing {data.length} out of {totalItems} items 
            {totalPages > 1 ? ` (Page ${currentPage} of ${totalPages})` : ''}
          </div>
        </>
      )}
    </div>
  );
};

export default DataFetcher;