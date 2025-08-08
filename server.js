const express = require("express");
const router = express.Router();
const AuthRoutes = require("./routes/authRoutes");
const UsersRoutes = require("./routes/usersRoutes")
const BookingRoutes = require("./routes/bookingRoutes")
const PaymentRoutes = require("./routes/PaymentRoutes")
const ReviewRoutes = require("./routes/ReviewRoutes")
const DashboardRoutes = require("./routes/DashboardRoutes")
const NewsRoutes = require("./routes/NewsRoutes")
const SpaceRoutes = require("./routes/SpaceRoutes")


router.use("/auth",AuthRoutes);
router.use("/booking",BookingRoutes);
router.use("/user",UsersRoutes);
router.use("/payment",PaymentRoutes);
router.use("/review",ReviewRoutes);
router.use("/dashboard",DashboardRoutes);
router.use("/news",NewsRoutes);
router.use("/space",SpaceRoutes);
module.exports = router;

