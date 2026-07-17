import React, { useState, useEffect } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilter";   

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  useEffect(()=>{
    async function loadProperties() {
      try{
        setLoading(true);
        setError(null);
        const data = await fetchProperties({ limit: 20, offset: 0, activeFilters});
        setProperties(data.results);
        setTotal(data.total);
      }
      catch(err){
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    }
    loadProperties();

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
  if (loading) {
    return <p className="status-message">Loading properties...</p>;
    <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
  }


  if (error) {
    return <p className="status-message error">Error: {error}</p>;
    <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
  }
  return(
    <div className="listings-page">
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
      <p className="results-count">Showing {properties.length} of {total} properties</p>
      
      <div className="property-grid">
        {properties.map((property) => (
          <PropertyCard key={property.L_ListingID} property={property} />
        ))}
      </div>
    </div>
  );
}