require('dotenv').config();

const USE_SMS = true;

const SIGN_TEMPLATE = {
    "signName": process.env.SMS_SIGN_NAME || "ququzhaofang",
    "templateCode": process.env.SMS_TEMPLATE_CODE || "SMS_464356139"
};

const SMS_METHOD = "shenzhi";

const SHENZHI_SMS_APPCODE = process.env.SHENZHI_SMS_APPCODE || "24b62f0bbb7e4c3b9e0b22c03b0dbd52";

module.exports = { USE_SMS, SIGN_TEMPLATE, SMS_METHOD, SHENZHI_SMS_APPCODE };