import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchPropertyDetail, fetchOpenHouses } from '../api/client'
import PropertyImageGallery from './PropertyImageGallery';
import PropertyMap from './PropertyMap';
import OpenHouses from './OpenHouse'
import { useNavigate } from "react-router-dom";

export default function PropertyDetailPage() {
    const navigate = useNavigate();

    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [openHouses, setOpenHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        async function loadData() {
            try{
                const [propertyData, openHouseData] = await Promise.all([
                fetchPropertyDetail(id),
                fetchOpenHouses(id),
            ]);
            setProperty(propertyData);
            setOpenHouses(openHouseData);
            }   
            catch (err) {
            setError(err.message);
            } 
            finally {
            setLoading(false);
            }
        }
        
        loadData();
        
    },[id]);

    if (loading) return <p className="detail-status">Loading property...</p>;
    if (error) return <p className="detail-status detail-status--error">Error: {error}</p>;
    if (!property) return <p className="detail-status detail-status--error">Property not found.</p>;
    const {
        L_SystemPrice: price,
        L_Address: address,
        L_City: city,
        L_State: state,
        L_Keyword2: beds,
        LM_Dec_3: baths,
        LM_Int2_3: sqft,
        YearBuilt: yearBuilt,       
        L_Remarks: description,
        L_Class: propertyType,
        L_Type_: propertySubType,
        L_Keyword1: lotSize,
        L_Keyword5: garageSpaces,
        L_Photos:photos,
        LMD_MP_Latitude: lat,
        LMD_MP_Longitude: lng


    } = property;
    return(
        <div className='property-detail'>
            <button className="back-to-listings" onClick={() => navigate("/")}>← Back to Listings</button>
            
            <PropertyImageGallery L_Photos={photos} alt={address} />
            <h1 className="detail-price">${price?.toLocaleString()}</h1>
            <p className="detail-address">{address}, {city}, {state}</p>
            <div className="detail-stats">
                <span>{beds} bd</span>
                <span>{baths} ba</span>
                <span>{sqft?.toLocaleString()} sqft</span>
                <span>Built {yearBuilt}</span>
            </div>
            <section className="detail-description">
                <h2>Description</h2>
                <p>{description}</p>
            </section>

            <section className="detail-property-info">
                <h2>Property Details</h2>
                <ul>
                <li>Type: {propertyType} {propertySubType && `(${propertySubType})`}</li>
                <li>Lot size: {lotSize}</li>
                <li>Garage spaces: {garageSpaces}</li>
                </ul>
            </section>
            <section className="detail-open-houses">
                <h2>Open Houses</h2>
                <OpenHouses openHouses={openHouses}/>
            </section>
            <PropertyMap lat={lat} lng={lng} />

        </div>
    )

}