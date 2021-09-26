const express = require('express');
const axios = require('axios');
const { client } = require('../DB/config');

const router = express.Router();

// This function is responsible for getting all the modules which user can accessed
const getModulesDetails = async (roles) => {
    let modules = [];
    // Loop through all roles in which user has access
    for (let role of roles) {
        // Get data of role
        const r = await axios.get(`http://localhost:8088/roles/name/${role}`);

        // If response length is 0 then continue
        if(r.data.hits.hits.length==0){continue;}

        //Add all modules of that role in modules array
        if (r.data.hits.hits[0]._source.modules.length > 0) {
            r.data.hits.hits[0]._source.modules.forEach(module => {
                modules.push(module);
            });
        }
    }
    return modules;
}

// Get all users
router.get('/', async (req, res) => {
    try {
        // Refresh users index
        await client.indices.refresh({ index: 'users' });

        // Get all the documents of index 'users'
        const response = await client.search({
            index: 'users',
        });

        // Send Response
        res.json(response);
    }
    catch (err) {
        // Send respone 500 if any error
        res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
    }
});

// Add new user
router.post('/', async (req, res) => {
    try {
        // Refresh users index
        await client.indices.refresh({ index: 'users' });

        // Save document in the 'users' index
        const response = await client.index({
            index: 'users',
            type: 'users',
            body: req.body
        });

        // Send Response
        res.json(response);
    }
    catch (err) {
        console.log(err);
        // Send respone 500 if any error
        res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        // Refresh users index
        await client.indices.refresh({ index: 'users' });

        // Save document in the 'users' index
        const response = await client.update({
            index: 'users',
            id: req.params.id,
            body: {
                doc: req.body
            }
        });

        // Send Response
        res.json(response);
    }
    catch (err) {
        if (err.displayName == "NotFound") {
            // Send 404 error
            res.sendStatus(404).json({ message: "User does not exists" });
        }
        else {
            // Send respone 500 if any error
            res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
        }

    }
});

// Get Details of user
router.get("/search", async (req, res) => {
    try {
        // Refresh users index
        await client.indices.refresh({ index: 'users' });

        // Get documents based on keyword search from 'users' index
        const response = await client.search({
            index: 'users',
            body: {
                "query": {
                    "query_string": {
                        "fields": ["userName", "email"],
                        "query": `*${req.query.keyword}*`
                    }
                }
            }
        });
        console.log(response);

        // Send Response
        res.json(response);
    }
    catch (err) {
        console.log(err);
        // Send respone 500 if any error
        res.sendStatus(500).json({ message: 'Internal Server Error', error: err })
    }
});


// Get Details of user
router.get("/:id", async (req, res) => {
    try {
        // Refresh users index
        await client.indices.refresh({ index: 'users' });

        // Get all the documents of index 'users'
        const response = await client.get({
            index: 'users',
            type: 'users',
            id: req.params.id
        });


        // Get all the modules
        let modules = [];
        if (response._source.roles) {
            modules = await getModulesDetails(response._source.roles);
        }

        // Make user data
        const user = response._source;
        user.id = response._id;
        user.modules = modules;

        // Send Response
        res.json(user);
    }
    catch (err) {
        if (err.displayName == "NotFound") {
            // Send 404 error
            res.sendStatus(404).json({ message: "User does not exists" });
        }
        else {
            // Send respone 500 if any error
            res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
        }
    }
});

// Delete User
router.delete("/:id", async (req, res) => {
    try {
        const result = await client.delete({
            index: "users",
            id: req.params.id
        });
        res.json(result);
    }
    catch (err) {
        if (err.displayName == "NotFound") {
            // Send 404 error
            res.sendStatus(404).json({ message: "User does not exists" });
        }
        else {
            // Send respone 500 if any error
            res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
        }
    }
});

//validate user
router.post('/validate', async (req, res) => {
    try {

        // Refresh users index
        await client.indices.refresh({ index: 'users' });

        // Get all the documents of index 'users'
        const response = await client.search({
            index: 'users',
            body: {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match_phrase_prefix": {
                                    email: req.body.email
                                }
                            },
                            {
                                "match_phrase_prefix": {
                                    password: req.body.password
                                }
                            }
                        ]
                    }
                }
            }
        });

        // Send Response
        res.json(response.hits.hits);
    }
    catch (err) {
        // Send respone 500 if any error
        console.log(err);
        //res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
    }
});

//check user if already exists
router.post('/checkUser', async (req, res) => {
    try {

        // Refresh users index
        await client.indices.refresh({ index: 'users' });


        const response = await client.search({
            index: 'users',
            body: {
                "query": {
                    match_phrase_prefix: {
                        email: req.body.email
                    }
                }
            }
        });

        // Send Response
        res.json(response.hits.hits);
    }
    catch (err) {
        // Send respone 500 if any error

        res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
    }
});

module.exports = router;