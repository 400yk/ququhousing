const { ROLES_LIST } = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const usersController = require('../../controllers/usersController');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.route('/')
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers);

module.exports = router;
