import React, { useState, useEffect, use } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./filter";   
import Pagination from "./Pagination";

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  useEffect(()=>{
    let ignore = false;
    async function loadProperties() {
      try{
        setLoading(true);
        setError(null);
        const offset=(currentPage - 1) * itemsPerPage;
        const data = await fetchProperties({ limit: itemsPerPage, offset, ...activeFilters});
      
        if (!ignore) {                 
          setProperties(data.results);
          setTotal(data.total);
        }
      }
      catch(err){
        if (!ignore) {
        setError(err.message);
        }
      }
      finally {
        if (!ignore) {
          setLoading(false);
        }      
      }
    }
    loadProperties();
    return ()=>{ignore=true}
  },[activeFilters, currentPage]);

  useEffect(() => {
  window.scrollTo(0, 0);
  }, [currentPage]);

  function handleSearch(filters){
    const cleaned = {};
    for (const key in filters) {
      if (filters[key] !== "") {
        cleaned[key] = filters[key];
      }
    }
    setActiveFilters(cleaned);
    setCurrentPage(1);
  }

  function handleClear() {
    setActiveFilters({});
    setCurrentPage(1);
  }
  function handlePageChange(page) {
  setCurrentPage(page);
  } 
  const totalPages = Math.ceil(total / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  
  
  return (
  <div className="listings-page">
    <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
    {loading && <p className="status-message">Loading properties...</p>}
    {!loading && error && <p className="status-message error">Error: {error}</p>}
    {!loading && !error && (
      <>
        <p className="results-count">Showing {startItem}-{endItem} of {total} properties</p>
        <div className="property-grid">
            {properties.map((property) => (
            <PropertyCard key={property.L_ListingID} property={property} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    )}
  </div>
);
}
