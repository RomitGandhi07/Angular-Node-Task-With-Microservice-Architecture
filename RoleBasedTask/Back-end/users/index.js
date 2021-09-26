const express = require('express');
const cors=require('cors');

const users=require('./routes/users');
const {checkDBConnection}=require('./DB/config');

const app = express();

// Check DB Connection
checkDBConnection();

// CORS middleware
app.use(cors());

// Middleware for reading request body
app.use(express.json());

// Users APIs
app.use('/users',users);


app.listen(8089, () =>{
    console.log("Users Service - Listening on port 8089");
});