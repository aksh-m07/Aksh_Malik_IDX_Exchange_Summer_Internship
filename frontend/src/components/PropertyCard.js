import React, { useState } from "react";
import { parsePhotos } from "../utils/photos";

export default function PropertyCard({ property }) {
      const {
    L_SystemPrice: price,
    L_Address: address,
    L_City: city,
    L_State: state,
    L_Keyword2: beds,
    LM_Dec_3: baths,
    L_Photos: rawPhotos,
    LM_Int2_3: sq
  } = property;
  const photos=parsePhotos(rawPhotos);
  const firstPhoto = photos.length > 0 ? photos[0] : null;
  const [imgError,setImgError]=useState(false)
  
  return(
    <div className="property-card">
         {firstPhoto && !imgError ? (
  <img src={firstPhoto} alt={address} className="property-photo" onError={() => setImgError(true)} /> ) : (<div className="property-photo-placeholder">No Photo Available</div>)}
      <div className="property-info">
      <p className="price">Price: ${price?.toLocaleString()}</p>
      <p className="address">Address: {address}</p>
      <p className="city-state">Loc: {city}, {state}</p>
      <p className="beds-baths">Bed and Baths: {beds} bd | {baths} ba</p>
      <p className="sqft">Sqft:{sq} </p>
    </div>
  </div>    
  );
}