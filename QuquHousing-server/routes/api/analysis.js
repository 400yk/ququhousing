const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const analysisController = require('../../controllers/analysisController');
const verifyRoles = require('../../middleware/verifyRoles');
const { ROLES_LIST } = require('../../config/roles_list');

router.use(bodyParser.json());

router.route('/')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Invitee), analysisController.PnLAnalysis);

module.exports = router;