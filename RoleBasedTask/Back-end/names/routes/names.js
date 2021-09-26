const express = require('express');
const axios = require('axios');
const { client } = require('../DB/config');

const router = express.Router();

// This function is responsible for getting all the names in one array 
const getAllNames = (response) => {
    const names = [];
    // Loop through response and add name to names array
    response.hits.hits.forEach(val => {
        names.push(val._source.name);
    });
    return names;
}

// This function is responsible for getting names which is accessed by user
const getNames = (names, privilleges) => {
    const data = [];
    // Loop through privilleges array
    privilleges.forEach(p => {
        // Loop through pattern inside them 
        p.pattern.forEach(val => {
            // Replace * with .* for regex & make regex
            val = val.replace('*', '.*');
            val = new RegExp("^" + val);

            // Find names which matches with regex
            const n = names.filter(value => val.test(value))

            // Loop through all names and add it to data
            n.forEach(name => {
                data.push({
                    name,
                    privilleges: p.privilleges
                });
            })
        });
    });
    return data;
}

// Get all names of an user of that module which is passed in query string
router.get('/', async (req, res) => {
    try {
        // Get data of role in which module is there
        const roleModules = await axios.get(`http://localhost:8088/roles/module/${req.query.module}`);
        const module = roleModules.data.hits.hits;

        // If module doesn't have any privillege then return empty json
        if (module.length == 0) {
            return res.json({});
        }

        // Get privilleges of that module
        privilleges = module[0]._source.modules.find(p => p.moduleName == req.query.module).privilleges;


        // Refresh roles index
        await client.indices.refresh({ index: 'names' });

        // Get all the documents of index 'roles' with the match of keyword
        const response = await client.search({
            index: 'names',
            body: {
                query: {
                    query_string: {
                        default_field: 'name',
                        query: `*${req.query.keyword}*`
                    }
                }
            }
        });


        // Get all the names in one array
        const names = getAllNames(response);

        // Get names which are accessed by user
        const accessedNames = getNames(names, privilleges);

        // Send Response
        res.json(accessedNames);
    }
    catch (err) {
        // Send respone 500 if any error
        console.log(err);
        res.sendStatus(500).json({ message: 'Internal Server Error', error: err });
    }
});

module.exports = router;