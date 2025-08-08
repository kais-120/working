const express = require("express");
const router = express.Router();

const AuthenticateToken = require("../middleware/AuthenticateToken");
const { overall, quickStatistics, calculateRevenue, membershipStats, lastBookings } = require("../controllers/DashboardController");
const AuthenticateDepartment = require("../middleware/AuthenticateDepartment");

router.get("/overall",[AuthenticateToken,AuthenticateDepartment],overall);
router.get("/quick_statistics",[AuthenticateToken,AuthenticateDepartment],quickStatistics);
router.get("/calculate_revenue",[AuthenticateToken,AuthenticateDepartment],calculateRevenue);
router.get("/membership_stats",[AuthenticateToken,AuthenticateDepartment],membershipStats);
router.get("/last_booking",[AuthenticateToken,AuthenticateDepartment],lastBookings);





module.exports = router;
