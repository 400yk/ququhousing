const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.route('/')
    .post(smsController.requestSMS);

router.route('/verify')
    .post(smsController.verifyPhone);

module.exports = router;

