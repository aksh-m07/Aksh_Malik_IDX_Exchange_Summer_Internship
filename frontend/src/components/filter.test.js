import { render, screen, fireEvent } from "@testing-library/react";
import PropertyFilters from "./filter";
import '@testing-library/jest-dom';

test("renders all six filter inputs", ()=>{
    render(<PropertyFilters onSearch={() => {}} onClear={() => {}} />);
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ZipCode")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("MinPrice")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("MaxPrice")).toBeInTheDocument();
    expect(screen.getByText("Beds: Any")).toBeInTheDocument();
    expect(screen.getByText("Baths: Any")).toBeInTheDocument();

});
test("submitting the form calls onSearch with the typed values", () => {
  const handleSearch = jest.fn();
  render(<PropertyFilters onSearch={handleSearch} onClear={() => {}} />);

  fireEvent.change(screen.getByPlaceholderText("City"), {
    target: { value: "San Diego" },
  });
  fireEvent.change(screen.getByPlaceholderText("MinPrice"), {
    target: { value: "300000" },
  });
  fireEvent.click(screen.getByText("Search"));

  expect(handleSearch).toHaveBeenCalledWith({
    city: "San Diego",
    zipcode: "",
    minPrice: "300000",
    maxPrice: "",
    beds: "",
    baths: "",
  });
});
test("clicking Clear Filters resets all inputs and calls onClear", () => {
  const handleClear = jest.fn();
  render(<PropertyFilters onSearch={()=>{}} onClear={() => {handleClear()}} />);
  const cityInput = screen.getByPlaceholderText("City");
  fireEvent.change(cityInput, { target: { value: "La Jolla" } });
  expect(cityInput.value).toBe("La Jolla");

  fireEvent.click(screen.getByText("Clear Filters"));

  expect(cityInput.value).toBe("");
  expect(handleClear).toHaveBeenCalledTimes(1);




});
