const express = require("express");
const router = express.Router();
const AuthenticateToken = require("../middleware/AuthenticateToken");
const AuthenticateAdmin = require("../middleware/AuthenticateAdmin");
const { createReview, updateReview, getReview, getReviewById } = require("../controllers/ReviewController");

router.post("/add",[AuthenticateToken], createReview);
router.put("/update/status/:id",[AuthenticateToken,AuthenticateAdmin], updateReview);
router.get("/all/:page",[AuthenticateToken,AuthenticateAdmin], getReview);
router.get("/get/:id",[AuthenticateToken,AuthenticateAdmin], getReviewById);


module.exports = router;
