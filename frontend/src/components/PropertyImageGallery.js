import { useState,useEffect } from 'react';
import { parsePhotos } from '../utils/photos';
export default function PropertyImageGallery({ L_Photos, alt = 'Property photo' }) {
    const photos = parsePhotos(L_Photos);
    const [mainIndex, setMainIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    if (photos.length === 0) {
        return (
        <div className="gallery gallery--empty">
            <span>No photos available</span>
        </div>
        );
    }
    useEffect(() => {
    if (!lightboxOpen) return;

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            setLightboxOpen(false);
        } else if (e.key === 'ArrowRight') {
            setMainIndex((prev) => (prev + 1) % photos.length);
        } else if (e.key === 'ArrowLeft') {
            setMainIndex((prev) => (prev - 1 + photos.length) % photos.length);
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
}, [lightboxOpen, photos.length]);
    return(
        <div className="gallery">
            <img
                className="gallery__main-image"
                src={photos[mainIndex]}
                alt={alt}
                onClick={() => setLightboxOpen(true)}
            />
            {photos.length>1 &&(
                <div className="gallery__thumbnails">
                    {photos.map((photo, i) => (
                        <img
                        key={i}
                        src={photo}
                        alt={`${alt} thumbnail ${i + 1}`}
                        className={`gallery__thumbnail ${i === mainIndex ? 'gallery__thumbnail--active' : ''}`}
                        onClick={() => setMainIndex(i)}
                        />
                    ))}
                </div>
            )}
            
            {lightboxOpen && (
                <div className="lightbox" onClick={() => setLightboxOpen(false)}>
                    <img
                        className="lightbox__image"
                        src={photos[mainIndex]}
                        alt={alt}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className="lightbox__close" onClick={() => setLightboxOpen(false)}>
                        &times;
                    </button>
                </div>
            )}
        </div>

    );

}