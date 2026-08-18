import React, { useState, useEffect } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/filter";
import Pagination from "../components/Pagination";




export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const itemsPerPage = 20;
  
  useEffect(()=>{
    let ignore = false;
    async function loadProperties() {
      try{
        setLoading(true);
        setError(null);
        const offset=(currentPage - 1) * itemsPerPage;
        const sortParams = {};
        if (sortBy) sortParams.sortBy = sortBy;
        if (sortOrder) sortParams.sortOrder = sortOrder;
        const data = await fetchProperties({ limit: itemsPerPage, offset, ...activeFilters,...sortParams });
      
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
  },[activeFilters, currentPage, sortBy, sortOrder]);

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
    setSortBy('');
    setSortOrder('');

  }

  function handleClear() {
    setActiveFilters({});
    setCurrentPage(1);
    setSortBy('');
    setSortOrder('');
  }
  function handleSortChange(newSortBy, newSortOrder) {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
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
    <div className="sort-controls">
      <label>
        Sort By:
        <select id="sortBy" name="sortBy" value={sortBy} onChange={(e) => handleSortChange(e.target.value, sortOrder || 'ASC')}>
          <option value="">None</option>
          <option value="price">Price</option>
          <option value="date">Date Listed</option>
          <option value="sqft">Square Footage</option>
          <option value="beds">Beds</option>
          <option value="baths">Baths</option>
        </select>
      </label>
      <label>
        Order:
        <select id="sortOrder" name="sortOrder" value={sortOrder} onChange={(e) => handleSortChange(sortBy, e.target.value)}>
          <option value="ASC">Low to High</option>
          <option value="DESC">High to Low</option>
        </select>
      </label>
      
    </div>
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
