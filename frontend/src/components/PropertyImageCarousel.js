import { useState } from 'react';
import { parsePhotos } from '../utils/photos';
export default function PropertyImageCarousel({ L_Photos, alt = 'Property photo' }) {
    const photos= parsePhotos(L_Photos);
    const [index, setIndex] = useState(0);

    if (photos.length===0){
        return <div className="carousel carousel--empty"><span>No photos available</span></div>
    }
    const goPrev = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const goNext = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    return(
        <div className="carousel">
            <img className="carousel__image" src={photos[index]} alt={alt} />
            {photos.length > 1 && (
                <>
                <button type="button" className="carousel__arrow carousel__arrow--prev" onClick={goPrev}>&#8249;</button>
                <button type="button" className="carousel__arrow carousel__arrow--next" onClick={goNext}>&#8250;</button>
                <span className="carousel__counter">{index + 1} / {photos.length}</span>
                </>
            )}
        </div>
    );


}
