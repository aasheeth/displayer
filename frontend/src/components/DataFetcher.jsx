import React, { useEffect, useState, useCallback } from "react";
import PluginManager from "./PluginManager";
import Loader from "./Loader";
import Pagination from "./Pagination";

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [format, setFormat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 12;

  const API_URL = `http://localhost:8000/api/json`;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;

      const response = await fetch(
        `${API_URL}?limit=${ITEMS_PER_PAGE}&skip=${skip}`
      );
      const contentType = response.headers.get("Content-Type");

      const Plugin = PluginManager.getPlugin(contentType);
      if (!Plugin) {
        throw new Error("Unsupported Content-Type: " + contentType);
      }

      const raw = await response.text();
      const result = await Plugin.Component.handleData(raw);

      setFormat(contentType);
      const items = result.users || result;
      setData(items);
      const total = result.total || items.length;
    // const total = parseInt(response.headers.get("X-Total-Count")) || items.length;
      setTotalItems(total);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const Plugin = PluginManager.getPlugin(format);
    // const pagedData = data.slice(0, currentPage * ITEMS_PER_PAGE);
  const pagedData = data;

  return isLoading && data.length === 0 ? (
    <Loader />
  ) : (
    <div>
      {Plugin && <Plugin.Component data={pagedData} />}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <div style={{ padding: "1rem" }}>
        Showing {pagedData.length} out of {totalItems} items (Page {currentPage}{" "}
        of {totalPages})
      </div>
    </div>
  );
};

export default DataFetcher;
