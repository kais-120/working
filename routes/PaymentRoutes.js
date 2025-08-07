const express = require("express");
const AuthenticateToken = require("../middleware/AuthenticateToken");
const { CreatePayment, VerifyPayment, paymentVerifyAdmin, sendReturnPayment } = require("../controllers/PaymentController");
const router = express.Router();

router.post("/create",[AuthenticateToken],CreatePayment);
router.put("/verify",VerifyPayment);
router.post("/verify/payment",[AuthenticateToken],paymentVerifyAdmin);
router.post("/send/payment/:payment_ref",sendReturnPayment);

module.exports = router