const express = require("express");
const AuthenticateToken = require("../middleware/AuthenticateToken");
const { CreatePayment, VerifyPayment, paymentVerifyAdmin } = require("../controllers/PaymentController");
const router = express.Router();

router.post("/create",[AuthenticateToken],CreatePayment);
router.put("/verify",[AuthenticateToken],VerifyPayment);
router.post("/verify/payment",[AuthenticateToken],paymentVerifyAdmin);

module.exports = router