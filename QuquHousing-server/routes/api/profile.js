const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profileController');

router.route('/')
    .get(profileController.getProfile)
    .post(profileController.updateProfile)
    .delete(profileController.deleteProfile);

module.exports = router;