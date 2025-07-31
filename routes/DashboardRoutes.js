const express = require("express");
const router = express.Router();

const AuthenticateToken = require("../middleware/AuthenticateToken");
const { overall, quickStatistics, calculateRevenue, membershipStats, lastBookings } = require("../controllers/DashboardController");
const AuthenticateAdmin = require("../middleware/AuthenticateAdmin");

router.get("/overall",[AuthenticateToken,AuthenticateAdmin],overall);
router.get("/quick_statistics",[AuthenticateToken,AuthenticateAdmin],quickStatistics);
router.get("/calculate_revenue",[AuthenticateToken,AuthenticateAdmin],calculateRevenue);
router.get("/membership_stats",[AuthenticateToken,AuthenticateAdmin],membershipStats);
router.get("/last_booking",[AuthenticateToken,AuthenticateAdmin],lastBookings);





module.exports = router;
