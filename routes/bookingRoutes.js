const express = require("express");
const router = express.Router();
const { createBooking, getAllBookings, UpdateBookingStatus, getBookingByUser, createBookingCustom, searchReference } = require("../controllers/bookingController");
const AuthenticateToken = require("../middleware/AuthenticateToken");
const AuthenticateAdmin = require("../middleware/AuthenticateAdmin");

router.post("/add",[AuthenticateToken], createBooking);
router.post("/add/custom",[AuthenticateToken], createBookingCustom);
router.get("/all/:page",[AuthenticateToken,AuthenticateAdmin], getAllBookings);
router.put("/update/status/:id",[AuthenticateToken,AuthenticateAdmin],UpdateBookingStatus)
router.get("/me/:page",[AuthenticateToken],getBookingByUser)
router.get("/search/:page",[AuthenticateToken],searchReference)


module.exports = router;
