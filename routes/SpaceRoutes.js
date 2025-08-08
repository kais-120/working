// routes/coworkingRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const AuthenticateToken = require("../middleware/AuthenticateToken");
const {createSpace,getSpaces,deleteSpace,getSpaceById, updateSpace, getPublicSpace} = require("../controllers/SpaceController");
const AuthenticateDepartment = require("../middleware/AuthenticateDepartment");


router.post("/add",[AuthenticateToken,AuthenticateDepartment,upload.fields([{name:"image"}])], createSpace);
router.get("/all/:page",[AuthenticateToken,AuthenticateDepartment], getSpaces);
router.get("/get/:id",[AuthenticateToken,AuthenticateDepartment], getSpaceById);
router.get("/public", getPublicSpace);
router.delete("/delete/:id", [AuthenticateToken,AuthenticateDepartment], deleteSpace);
router.put("/update/:id", [AuthenticateToken,AuthenticateDepartment,upload.fields([{name:"image"}])], updateSpace);


module.exports = router;
