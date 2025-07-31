const express = require("express");
const router = express.Router();
const AuthRoutes = require("./routes/authRoutes");
const UsersRoutes = require("./routes/usersRoutes")
const SpaceRoutes = require("./routes/SpaceRoutes")
const EquipmentRoutes = require("./routes/EquipmentRoutes");
const BookingRoutes = require("./routes/bookingRoutes")
const PaymentRoutes = require("./routes/PaymentRoutes")
const ReviewRoutes = require("./routes/ReviewRoutes")
const DashboardRoutes = require("./routes/DashboardRoutes")


router.use("/auth",AuthRoutes);
router.use("/space",SpaceRoutes);
router.use("/booking",BookingRoutes);
router.use("/user",UsersRoutes);
router.use("/equipment",EquipmentRoutes);
router.use("/payment",PaymentRoutes);
router.use("/review",ReviewRoutes);
router.use("/dashboard",DashboardRoutes);
module.exports = router;

