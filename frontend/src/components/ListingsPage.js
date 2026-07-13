import React, { useState, useEffect } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(()=>{
    async function loadProperties() {
      try{
        setLoading(true);
        setError(null);
        const data = await fetchProperties({ limit: 20, offset: 0 });
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

  },[]);
  if (loading) {
    return <p className="status-message">Loading properties...</p>;
  }

  if (error) {
    return <p className="status-message error">Error: {error}</p>;
  }
  return(
    <div className="listings-page">
      <p className="results-count">Showing {properties.length} of {total} properties</p>
      <div className="property-grid">
        {properties.map((property) => (
          <PropertyCard key={property.L_ListingID} property={property} />
        ))}
      </div>
    </div>
  );
}