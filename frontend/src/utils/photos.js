// L_Photos comes from the MLS feed as a JSON-encoded string (e.g.
// '["photo1.jpg","photo2.jpg"]'), not a plain comma-separated list —
// this parses it into a real array for the carousel to render.
export function parsePhotos(rawPhotos) {
  // Guard against missing/non-string input (undefined property, or a
  // field that's already something other than a string) before ever
  // attempting to parse. JSON.parse would throw on non-string input
  // anyway, but this avoids relying on the try/catch for that case and
  // makes the "no photos" path explicit.
  if (!rawPhotos || typeof rawPhotos !== "string") {
    return [];
  }
  try{
    // ensures only genuine arrays are returned, so callers can always
    // safely treat the result as a list of photo URLs.
    const parsed = JSON.parse(rawPhotos);
    return Array.isArray(parsed) ? parsed : [];
  }
  catch{
    return [];
  }
}