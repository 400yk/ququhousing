const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bizcircleController = require('../../controllers/bizcircleController');
const verifyRoles = require('../../middleware/verifyRoles');
const { ROLES_LIST } = require('../../config/roles_list');

// var app = express();
router.use(bodyParser.json());

router.route('/')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Invitee), bizcircleController.analyzeBircircle);

module.exports = router;