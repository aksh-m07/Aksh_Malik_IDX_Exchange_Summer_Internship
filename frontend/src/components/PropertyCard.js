import { Link } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel"
import PropTypes from "prop-types";

export default function PropertyCard({ property }) {
      const {
    L_SystemPrice: price,
    L_Address: address,
    L_City: city,
    L_State: state,
    L_Keyword2: beds,
    LM_Dec_3: baths,
    L_Photos: rawPhotos,
    LM_Int2_3: sq,
    L_ListingID: id

  } = property;
  
  return(
    <Link to={`/property/${id}`} className="property-card-link">
      <div className="property-card">
        <PropertyImageCarousel L_Photos={rawPhotos} alt={address} />
        <div className="property-info">
          <p className="price">Price: ${price?.toLocaleString()}</p>
          <p className="address">Address: {address}</p>
          <p className="city-state">Loc: {city}, {state}</p>
          <p className="beds-baths">Bed and Baths: {beds} bd | {baths} ba</p>
          <p className="sqft">Sqft:{sq} </p>
        </div>
      </div>
    </Link>
  
  );
}
PropertyCard.propTypes={
  property:PropTypes.shape({
    L_SystemPrice: PropTypes.number,
    L_Address: PropTypes.string,
    L_City: PropTypes.string,
    L_State: PropTypes.string,
    L_Keyword2: PropTypes.number,
    LM_Dec_3: PropTypes.string,
    L_Photos: PropTypes.string,
    LM_Int2_3: PropTypes.number,
    L_ListingID: PropTypes.string,
  }).isRequired
}
