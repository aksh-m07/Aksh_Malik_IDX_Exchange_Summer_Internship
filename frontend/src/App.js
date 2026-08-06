import React from "react";
import ListingsPage from "./components/ListingsPage";
import { Routes, Route } from "react-router-dom";
import PropertyDetailPage from "./components/PropertyDetailPage"; 

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ListingsPage />} />
      <Route path="/property/:id" element={<PropertyDetailPage />} />
    </Routes>
  )

}