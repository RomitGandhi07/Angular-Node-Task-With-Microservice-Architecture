const express = require('express');
const axios = require('axios');
const { client } = require('../DB/config');

const router = express.Router();


// This function is responsible for getting all the user who has assigned to this roles
const getUsersWhoHasRole = async (name) => {
    // Refresh users index
    await client.indices.refresh({ index: 'users' });

    const response = await client.search({
        index: 'users',
        body: {
            query: {
                match: {
                    "roles": name
                }
            }
        }
    });

    return response.hits.hits;
}

// This function is responsible for removing the role from the user
const removeRoleFromUsers = async (users, name) => {
    // Loop through all users who has this role
    for (let user of users) {
        // Remove the role from array
        const index = user._source.roles.findIndex(n => n == name);
        user._source.roles.splice(index, 1);
        
        //Update the user
        const response = await axios.put(`http://localhost:8089/users/${user._id}`, user._source);
    }
}

// Get all roles
router.get('/', async (req, res) => {
    // GET roles/_search
    try {
        // Refresh roles index
        await client.indices.refresh({ index: 'roles' });

        // Get all the documents of index 'roles'
        const response = await client.search({
            index: 'roles',
        });

        // Send Response
        res.json(response);
    }
    catch (err) {
        // Send respone 500 if any error
        res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
    }
});

// Create new role
router.post('/', async (req, res) => {
    try {
        // Refresh roles index
        await client.indices.refresh({ index: 'roles' });

        // Save document in the 'roles' index
        const response = await client.index({
            index: 'roles',
            type: 'roles',
            body: req.body
        });

        // Send Response
        res.json(response);
    }
    catch (err) {
        // Send respone 500 if any error
        res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
    }
});

// Get Details of user
router.get("/search", async (req, res) => {
    try {
        // Refresh users index
        await client.indices.refresh({ index: 'roles' });

        // Get documents based on keyword search from 'users' index
        const response = await client.search({
            index: 'roles',
            type: 'roles',
            body: {
                "query": {
                    "query_string": {
                        "default_field": "name",
                        "query": `*${req.query.keyword}*`
                    }
                }
            }
        });


        // Send Response
        res.json(response);
    }
    catch (err) {
        // Send respone 500 if any error
        res.sendStatus(500).json({ message: 'Internal Server Error', error: err })
    }
});

// Get the module details using module name 
router.get("/name/:name", async (req, res) => {

    try {
        // Refresh roles index
        await client.indices.refresh({ index: 'roles' });

        //
        const result = await client.search({
            index: "roles",
            type: "roles",
            body: {
                query: {
                    match: {
                        "name": req.params.name
                    }
                }
            }
        });

        // Send response
        res.json(result);
    }
    catch (err) {

        console.log(err);
        res.status(500).json({
            message: "Something went wrong..."
        })

    }

});


// Get the role which is having that module name 
router.get("/module/:name", async (req, res) => {

    try {
        // Refresh roles index
        await client.indices.refresh({ index: 'roles' });

        //
        const result = await client.search({
            index: "roles",
            type: "roles",
            body: {
                query: {
                    match: {
                        "modules.moduleName": req.params.name
                    }
                }
            }
        });

        // Send response
        res.json(result);
    }
    catch (err) {

        res.status(500).json({
            message: "Something went wrong..."
        })
    }

});

router.get("/:id", async (req, res) => {
    try {
        // Refresh roles index
        await client.indices.refresh({ index: 'roles' });

        // Get all the documents of index 'roles'
        const response = await client.get({
            index: 'roles',
            type: 'roles',
            id: req.params.id
        });

        // Send Response
        res.json(response);
    }
    catch (err) {
        if (err.displayName == "NotFound") {
            // Send 404 error
            res.sendStatus(404).json({ message: "Role does not exists" });
        }
        else {
            // Send respone 500 if any error
            res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
        }
    }
});

// Update role
router.put('/:id', async (req, res) => {
    try {
        // Refresh users index
        await client.indices.refresh({ index: 'roles' });

        // update document in the 'role' index
        const response = await client.update({
            index: 'roles',
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



// Delete the role
router.delete("/:id", async (req, res) => {

    try {
        // Check which users has this role
        const usersWhoHasRole = await getUsersWhoHasRole(req.query.name);

        // If any user has this role then remove from them
        if (usersWhoHasRole) {
            // Remove Role form users 
            removeRoleFromUsers(usersWhoHasRole, req.query.name);
        }

        // Refresh roles index
        await client.indices.refresh({ index: 'roles' });

        // Delete the role
        const result = await client.delete({
            index: "roles",
            id: req.params.id
        });

        // Send response
        res.json(result);
    }
    catch (err) {
        if (err.displayName == "NotFound") {
            res.status(400).json({
                message: "Role does not exists"
            })
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Something went wrong..."
            })
        }
    }

});


module.exports = router;