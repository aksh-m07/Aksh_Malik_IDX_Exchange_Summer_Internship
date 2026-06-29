const express=require('express');
const router=express.Router()
const db = require('../db');
function validateQueryParams({ limit, offset, minPrice, maxPrice, beds, baths }) {
  const errors = [];
  if(limit!==undefined){
        const l=Number(limit);
        if (!Number.isInteger(l) || l <= 0 || l > 100) {
        errors.push('limit must be an integer between 1 and 100');
        }
    }
    if (offset !== undefined){
        const o = Number(offset);
        if (!Number.isInteger(o) || o < 0) {
            errors.push('offset must be a non-negative integer');
        }
    }
    if (minPrice !== undefined) {
        const mn = Number(minPrice);
        if (isNaN(mn)) {
            errors.push('minPrice must be a number');
        } 
        else if (mn < 0) {
            errors.push('minPrice must be a non-negative number');
        }
    }
    if (maxPrice !== undefined) {
        const ma = Number(maxPrice);
        if (isNaN(ma)) {
            errors.push('minPrice must be a number');
        } 
        else if (ma < 0) {
            errors.push('maxPrice must be a non-negative number');
        }
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
        if (Number(minPrice) >= Number(maxPrice)) {
            errors.push('minPrice must be less than maxPrice');
        }
    }
    if(beds !== undefined){
        const bd=Number(beds);
        if(!Number.isInteger(bd)|| bd<=0){
            errors.push('beds must be a positive integer')
        }
    }
    if (baths !== undefined) {
        const bt = Number(baths);
        if (!Number.isInteger(bt) || bt <= 0) {
            errors.push('baths must be a positive integer');
        }
    }
    return errors;
}

router.get('/', async(req, res) =>{
    const {city, zipcode, minPrice, maxPrice, beds, baths, limit=10,offset=0}=req.query;
    const errors = validateQueryParams({ limit, offset, minPrice, maxPrice, beds, baths });
    if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
    }
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);
    const conditions = [];
    const values = [];
    if (city) {
    conditions.push('LOWER(TRIM(L_City)) = LOWER(TRIM(?))');
    values.push(city);
    }

    if (zipcode) {
    conditions.push('L_Zip = ?');
    values.push(zipcode);
    }

    if (minPrice !== undefined) {
    conditions.push('L_SystemPrice >= ?');
    values.push(Number(minPrice));
    }

    if (maxPrice !== undefined) {
    conditions.push('L_SystemPrice <= ?');
    values.push(Number(maxPrice));
    }

    if (beds !== undefined) {
    conditions.push('L_Keyword2 = ?');
    values.push(Number(beds));
    }

    if (baths !== undefined) {
    conditions.push('L_Keyword5 = ?');
    values.push(Number(baths));
    }
    const whereclause=conditions.length>0?`WHERE ${conditions.join(' AND ')}` :'';
    try{
        const [countResult] = await db.query(
        `SELECT COUNT(*) AS total FROM rets_property ${whereclause}`,values);
        const total = countResult[0].total;
        const [rows]=await db.query(`SELECT * FROM rets_property ${whereclause} LIMIT ? OFFSET ?`, [...values, parsedLimit, parsedOffset]);
        return res.json({
            total,
            limit: parsedLimit,
            offset: parsedOffset,
            results: rows,
        });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({error: 'Internal server error' });
    }
});
module.exports = router;
