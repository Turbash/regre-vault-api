const express = require('express');
const app = express();
const dotenv = require('dotenv');

const dbConnect=require('./db/db');

dotenv.config();

app.get('/', async (req, res) => {
    try{
        await dbConnect();
        console.log('Database connected successfully');
    }
    catch(err){
        console.error('Database connection failed:', err);
    }
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});