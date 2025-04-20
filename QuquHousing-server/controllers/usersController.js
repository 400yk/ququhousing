const fsPromises = require('fs').promises;
const path = require('path');
const query = require('../config/query');

const getAllUsers = async (req, res) => {
    const data = await query(`SELECT username, roles, memberExpiration FROM userInfo`);
    // const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'users.json'));
    res.json(data);
}

module.exports = { getAllUsers };