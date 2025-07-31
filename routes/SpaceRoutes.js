// routes/coworkingRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const AuthenticateAdmin = require("../middleware/AuthenticateAdmin");
const AuthenticateToken = require("../middleware/AuthenticateToken");
const {createSpace,getSpaces,deleteSpace,getSpaceById} = require("../controllers/SpaceController");
const AuthenticateOwner = require("../middleware/AuthenticateOwner");


router.post("/add",[AuthenticateToken,AuthenticateAdmin,AuthenticateOwner,upload.fields([{name:"image",maxCount:8}])], createSpace);
router.get("/get/:id", getSpaceById);
router.delete("/delete/:id", [AuthenticateToken,AuthenticateAdmin,AuthenticateOwner], deleteSpace);
router.get("/all", getSpaces);


module.exports = router;
