import React from "react";
import ListingsPage from "./components/ListingsPage";
import { Routes, Route } from "react-router-dom";
import PropertyDetailPage from "./components/PropertyDetailPage"; 
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ErrorBoundary><ListingsPage /></ErrorBoundary>} />
      <Route path="/property/:id" element={<ErrorBoundary><PropertyDetailPage /></ErrorBoundary>} />
    </Routes>
  )

}