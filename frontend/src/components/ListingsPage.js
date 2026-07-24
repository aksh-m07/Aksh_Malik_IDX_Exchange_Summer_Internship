import React, { useState, useEffect, use } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./filter";   

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  useEffect(()=>{
    let ignore = false;
    async function loadProperties() {
      try{
        setLoading(true);
        setError(null);
        const data = await fetchProperties({ limit: 20, offset: 0, ...activeFilters});
      
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
  },[activeFilters]);

  function handleSearch(filters){
    const cleaned = {};
    for (const key in filters) {
      if (filters[key] !== "") {
        cleaned[key] = filters[key];
      }
    }
    setActiveFilters(cleaned);
  }

  function handleClear() {
  setActiveFilters({});
  }
  
  return (
  <div className="listings-page">
    <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
    {loading && <p className="status-message">Loading properties...</p>}
    {!loading && error && <p className="status-message error">Error: {error}</p>}
    {!loading && !error && (
      <>
        <p className="results-count">Showing {properties.length} of {total} properties</p>
        <div className="property-grid">
            {properties.map((property) => (
            <PropertyCard key={property.L_ListingID} property={property} />
          ))}
        </div>
      </>
    )}
  </div>
);
}
