const express = require('express');
const router = express.Router();
const renewalController = require('../../controllers/renewalController');
const { ROLES_LIST } = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.Admin), renewalController.membershipRenew)


module.exports = router;