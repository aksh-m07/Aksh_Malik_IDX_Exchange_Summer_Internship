import { text } from "node:stream/consumers";
import React, { useState } from "react";
export default function PropertyFilters({ onSearch, onClear }) {
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("")
  
  function handleSubmit(e){
    e.preventDefault();
    onSearch({ city, zipcode, minPrice, maxPrice, beds, baths });
  }

  function handleClear() {
    setCity("");
    setZipcode("");
    setMinPrice("");
    setMaxPrice("");
    setBeds("");
    setBaths("");
    onClear();
  }

  return (
    <form className="property-filters" onSubmit={handleSubmit}>
        <input 
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        />
        <input 
        type="text"
        placeholder="ZipCode"
        value={zipcode}
        onChange={(e) => setZipcode(e.target.value)}
        />
        <input 
        type="number"
        placeholder="MinPrice"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        />
        <input 
        type="number"
        placeholder="MaxPrice"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select value={beds} onChange={(e) => setBeds(e.target.value)}>
            <option value="">Beds: Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        <select value={baths} onChange={(e) => setBaths(e.target.value)}>
            <option value="">Baths: Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <button type="submit">Search</button>
            <button type="button" onClick={handleClear}>
                Clear Filters
            </button>
        </select>

    </form>
  );
}