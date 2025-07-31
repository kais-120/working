const express = require('express');
const router = express.Router();
const { users,deleteUser, getUserById, addOwner, searchUser } = require('../controllers/userController.js');
const AuthenticateAdmin = require('../middleware/AuthenticateAdmin');
const AuthenticateToken = require('../middleware/AuthenticateToken');

router.get('/all/:page', [AuthenticateToken,AuthenticateAdmin],users);
router.get('/get/:id', [AuthenticateToken,AuthenticateAdmin],getUserById);
router.delete("/delete/:id",[AuthenticateToken,AuthenticateAdmin], deleteUser);
router.post("/add/owner",[AuthenticateToken,AuthenticateAdmin], addOwner);
router.get("/search/:page",[AuthenticateToken,AuthenticateAdmin], searchUser);


module.exports = router;
