const express = require('express');
const router = express.Router();
const payNotifyController = require('../../controllers/payNotifyController');

router.route('/')
    .get(payNotifyController.paymentSuccess);

module.exports = router;