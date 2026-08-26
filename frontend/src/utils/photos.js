
export function parsePhotos(rawPhotos) { 
  
  if (!rawPhotos || typeof rawPhotos !== "string") {// guard against missing/non-string input
    return [];
  }
  try{
    const parsed = JSON.parse(rawPhotos);// L_Photos is a JSON encoded array string, not comma-separated
    return Array.isArray(parsed) ? parsed : []; // JSON.parse can succeed on non-array JSON too, so confirm the shape
  }
  catch{
    return [];// malformed JSON from the feed shouldn't crash the component
  }
}