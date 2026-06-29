const express=require('express');
const cors=require('cors');
require('dotenv').config();
const db =require('./db');
const app=express();
const PORT=process.env.PORT ||8000;
app.use(cors());
app.use(express.json());

app.get('/api/health', async (req,res) =>{
    try{
        await db.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    }
    catch(err){
         res.status(500).json({ status: 'error', database: 'disconnected', message: err.message });

    }
    

});
const propertiesRouter = require('./routes/properties');
app.use('/api/properties', propertiesRouter);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


