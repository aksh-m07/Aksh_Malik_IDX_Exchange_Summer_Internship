import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import "@testing-library/jest-dom";

jest.mock("./PropertyImageCarousel", () => () => <div data-testid="carousel-stub" />);

const mockProperty = {
  L_SystemPrice: 750000,
  L_Address: "123 Main St",
  L_City: "San Diego",
  L_State: "CA",
  L_Keyword2: 3,
  LM_Dec_3: "2",
  L_Photos: "photo1.jpg,photo2.jpg",
  LM_Int2_3: 1800,
  L_ListingID: "456",
};

function renderWithRouter() {
    return render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<PropertyCard property={mockProperty} />} />
                <Route path="/property/:id" element={<div>Detail Page</div>} />
            </Routes>
        </MemoryRouter>
    )
}

test("renders property data", () => {
  renderWithRouter();
  expect(screen.getByText("Price: $7,50,000")).toBeInTheDocument();
  expect(screen.getByText("Address: 123 Main St")).toBeInTheDocument();
  expect(screen.getByText("Loc: San Diego, CA")).toBeInTheDocument();
  expect(screen.getByText("Bed and Baths: 3 bd | 2 ba")).toBeInTheDocument();
  expect(screen.getByText("Sqft:1800")).toBeInTheDocument();
});

test("clicking the card navigates to the detail page", async () => {
  const user = userEvent.setup();
  renderWithRouter();
  await user.click(screen.getByText("Address: 123 Main St"));
  expect(screen.getByText("Detail Page")).toBeInTheDocument();
});