import React from "react";
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
  } = property;
  const photos=parsePhotos(rawPhotos);
  prconst firstPhoto = photos.length > 0 ? photos[0] : null;

}