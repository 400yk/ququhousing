const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');

router.route('/')
    .get(orderController.getOfferings)
    .post(orderController.createOrder);

router.route('/checkPay')
    .get(orderController.checkPay);


module.exports = router;