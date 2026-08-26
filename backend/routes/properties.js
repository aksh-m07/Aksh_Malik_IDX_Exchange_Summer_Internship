const express=require('express');
const router=express.Router()
const db = require('../db');

router.use((req,res,next) =>{
    const start = Date.now();
    res.on('finish',()=>{
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
        
    });
    next();
   
});

const SORT_WHITELIST = { // whitelist prevents injecting arbitrary column names via ?sortBy=
  price: 'L_SystemPrice',
  date: 'ListingContractDate',
  sqft: 'LM_Int2_3',
  beds: 'L_Keyword2',
  baths: 'LM_Dec_3',
};
function validateQueryParams({ limit, offset, minPrice, maxPrice, beds, baths, sortBy, sortOrder }) {
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
    if (sortBy!=undefined){
        if (!(sortBy in SORT_WHITELIST)) {
            errors.push('sortBy must be one of: ' + Object.keys(SORT_WHITELIST).join(', '));
        }
    }
    if (sortOrder!=undefined){
        const validOrders = ['ASC', 'DESC'];
        if (!validOrders.includes(sortOrder.toUpperCase())) {
            errors.push('sortOrder must be ASC or DESC');
        }
    }
    return errors;
}

router.get('/', async(req, res) =>{
    const {city, zipcode, minPrice, maxPrice, beds, baths, limit=10,offset=0, sortBy, sortOrder}=req.query;
    const errors = validateQueryParams({ limit, offset, minPrice, maxPrice, beds, baths, sortBy, sortOrder  });
    if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
    }
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);
    const conditions = [];// SQL fragments for the WHERE clause
    const values = [];// parallel array, one value per '?' placeholder, in the same order
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
        conditions.push('LM_Dec_3 = ?');
        values.push(Number(baths));
    }

    const whereclause=conditions.length>0?`WHERE ${conditions.join(' AND ')}` :'';
    let orderByClause=''
    if (sortBy!== undefined){
        const column = SORT_WHITELIST[sortBy];
        const direction = sortOrder !== undefined ? sortOrder.toUpperCase() : 'ASC';
        orderByClause = `ORDER BY ${column} ${direction}`;
    }
    try{
        const [countResult] = await db.query(
        `SELECT COUNT(*) AS total FROM rets_property ${whereclause}`,values);// total match count, for pagination UI
        const total = countResult[0].total;
        const [rows]=await db.query(`SELECT * FROM rets_property ${whereclause} ${orderByClause} LIMIT ? OFFSET ?`, [...values, parsedLimit, parsedOffset]);// limit/offset appended last, matching '?' order in the SQL
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

router.get('/:id/openhouses', async(req,res)=>{
    const {id}=req.params;

    if (!id || id.length > 50 || !/^[a-zA-Z0-9_-]+$/.test(id)){// alphanumeric/underscore/hyphen only, max 50 chars
        return res.status(400).json({error: 'Invalid listing ID'});
    }
    try{
        const [Propertyrows]=await db.query('SELECT id from rets_property WHERE L_ListingID = ?',[id])
        if(Propertyrows.length==0){
            return res.status(404).json({ error: 'Property not found' });
        }
        const [openHouses] = await db.query('SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate ASC, OH_StartTime ASC',[id]);
        return res.json(openHouses);

    }
    catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' })
    }
    
});

router.get('/:id', async(req,res)=>{ // must be registered before '/:id' below, or this route never matches
    const {id}=req.params;
    if (!id || id.length > 50 || !/^[a-zA-Z0-9_-]+$/.test(id)){
        return res.status(400).json({error: 'Invalid listing ID'});
    }
    try{
        const [rows]=await db.query('SELECT * FROM rets_property WHERE L_ListingID = ?',[id]);
        if(rows.length==0){
            return res.status(404).json({ error: 'Property not found' });
        }
        return res.json(rows[0])
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' })
    }
});





module.exports = router;
