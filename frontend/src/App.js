import React from "react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ErrorBoundary><ListingsPage /></ErrorBoundary>} />
      <Route path="/property/:id" element={<ErrorBoundary><PropertyDetailPage /></ErrorBoundary>} />
    </Routes>
  )

}