const express = require('express');

const app = express();
const query = require('../config/query');

// Middleware to check trial expiration
const behaviorTracking = async (req, res, next) => {
    if (req?.body) {
        const search_content = JSON.stringify(req.body);
        await query(`INSERT INTO searchHistory (username, search_query) \
        VALUES (${req.user}, '${search_content}')`);
    }
    next();
}


module.exports = behaviorTracking;