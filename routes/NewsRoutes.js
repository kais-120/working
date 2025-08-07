const express = require("express");
const AuthenticateToken = require("../middleware/AuthenticateToken");
const AuthenticateDepartment = require("../middleware/AuthenticateDepartment");
const upload = require("../middleware/uploadMiddleware");
const { createNews, getAll, getById, getPublic, deleteNews, updateNews, updateStatus } = require("../controllers/NewsController");
const router = express.Router();
router.post("/add",[AuthenticateToken,AuthenticateDepartment,upload.fields([{name:"image"}])],createNews)
router.get("/all/:page",[AuthenticateToken,AuthenticateDepartment],getAll)
router.get("/get/:id",[AuthenticateToken,AuthenticateDepartment],getById)
router.get("/public",getPublic)
router.delete("/delete/:id",[AuthenticateToken,AuthenticateDepartment],deleteNews)
router.put("/update/:id",[AuthenticateToken,AuthenticateDepartment,upload.fields([{name:"image"}])],updateNews)
router.put("/status/update/:id",[AuthenticateToken,AuthenticateDepartment],updateStatus)

module.exports = router;