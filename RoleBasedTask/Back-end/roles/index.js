const express = require('express');
const cors=require('cors');

const roles=require('./routes/roles');
const {checkDBConnection}=require('./DB/config');

const app = express();

// Check DB Connection
checkDBConnection();

// CORS middleware
app.use(cors());

// Middleware for reading request body
app.use(express.json());

// Roles APIs
app.use('/roles',roles);

// This route is responsible for creating the indexes in Elasticsearch
app.post('/createIndex', async (req, res) => {
    try {
        const response = await client.indices.create({
            index: req.body.name
        });
        res.json(response);
    }
    catch (err) {
        // return res.sendStatus(500).json({ error: err });
    }
});

app.listen(8088, () =>{
    console.log("Roles Service - Listening on port 8088");
});