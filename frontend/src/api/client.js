const BASE_URL = "/api/properties";
async function request(path){
    let response;
    try{
        response=await fetch(`${BASE_URL}${path}`);
    }
    catch (networkError) {
    throw new Error("Could not reach the server. Is Express running?");
    }
    if(!response.ok){
        let detail=response.statusText;
        try{
            const body = await response.json();
            detail=body.error || detail;
        }
        catch{}
        throw new Error(`Request failed (${response.status}): ${detail}`);
    }
    return response.json();
}
export async function fetchProperties({ limit = 20, offset = 0, city, minPrice, maxPrice, beds, baths, sortBy, sortOrder} = {}) {
    const params=new URLSearchParams();
    params.set("limit",limit);
    params.set("offset",offset);
    if(city) params.set("city",city);
    if (minPrice !== undefined) params.set("minPrice", minPrice);
    if (maxPrice !== undefined) params.set("maxPrice", maxPrice);
    if (beds !== undefined) params.set("beds", beds);
    if (baths !== undefined) params.set("baths", baths);
    if (sortBy !== undefined) params.set("sortBy", sortBy);
    if (sortOrder !== undefined) params.set("sortOrder", sortOrder);

    return request(`?${params.toString()}`);
}
export async function fetchPropertyDetail(id) {
    if (!id) {
    throw new Error("fetchPropertyDetail requires a property id");
    } 
    return request(`/${id}`);
}
export async function fetchOpenHouses(id) {
    if (!id) {
        throw new Error("fetchOpenHouses requires a property id");
    }
    return request(`/${id}/openhouses`);
}

