const express = require("express");
const AuthenticateOwner = require("../middleware/AuthenticateOwner");
const AuthenticateAdmin = require("../middleware/AuthenticateAdmin");
const AuthenticateToken = require("../middleware/AuthenticateToken");
const router = express.Router();

router.post("/add",[AuthenticateToken,AuthenticateAdmin,AuthenticateOwner]);
router.get("/all",[AuthenticateToken,AuthenticateAdmin,AuthenticateOwner]);
router.get("/get/:id",[AuthenticateToken,AuthenticateAdmin,AuthenticateOwner]);
router.delete("/delete/:id",[AuthenticateToken,AuthenticateAdmin,AuthenticateOwner]);
router.put("/update/:id",[AuthenticateToken,AuthenticateAdmin,AuthenticateOwner]);

module.exports = router