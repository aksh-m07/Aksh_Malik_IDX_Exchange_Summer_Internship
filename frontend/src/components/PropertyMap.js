export default function PropertyMap({ lat, lng }) {
    if (!lat || !lng) {
        return null;
    }

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    return (
        <div className="property-map">
            <iframe 
                title="Property location"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={embedUrl}
            />
            <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-link">Get Directions

            </a>
        </div>

    )


}