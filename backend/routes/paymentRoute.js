const express = require("express");

const router = express.Router();

const {isautheticateduser} = require("../middleware/auth");
const { processPayment, sendStripeApiKey } = require("../controllers/paymentcontroller");


router.route("/payment/process").post(isautheticateduser,processPayment);

router.route("/stripeapikey").get(isautheticateduser,sendStripeApiKey);

module.exports=router;