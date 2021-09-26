const express = require('express');
const cors=require('cors');

const names=require('./routes/names');
const {checkDBConnection}=require('./DB/config');

const app = express();

// Check DB Connection
checkDBConnection();

// CORS middleware
app.use(cors());

// Middleware for reading request body
app.use(express.json());

// Names APIs
app.use('/names',names);


app.listen(8090, () =>{
    console.log("Names Service - Listening on port 8090");
});