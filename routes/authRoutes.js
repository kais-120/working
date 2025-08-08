const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  updateProfile,
  updatePassword,
  updateEmail,
} = require("../controllers/authController");

const AuthenticateToken = require("../middleware/AuthenticateToken");

router.post("/register",register);
router.post("/login", login);
router.get("/profile", AuthenticateToken,profile);
router.put("/update/information",AuthenticateToken, updateProfile);
router.put("/update/email",AuthenticateToken, updateEmail);
router.put("/update/password",AuthenticateToken, updatePassword);




module.exports = router;
