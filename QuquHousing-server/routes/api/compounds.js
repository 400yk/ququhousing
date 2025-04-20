const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const compoundsController = require('../../controllers/compoundsController');
const verifyRoles = require('../../middleware/verifyRoles');
const { ROLES_LIST } = require('../../config/roles_list');

router.use(bodyParser.json());

router.route('/search')
    .post(verifyRoles(ROLES_LIST.User), compoundsController.searchCompounds);

router.route('/isochrone')
    .post(verifyRoles(ROLES_LIST.User), compoundsController.searchByIsochrone);

module.exports = router;