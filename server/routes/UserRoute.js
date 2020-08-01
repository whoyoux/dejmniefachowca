const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/UserController');
const auth = require('../config/auth');

router.post("/register", UserControllers.registerNewUser);
router.post("/login", UserControllers.loginUser);
router.get("/me", auth, UserControllers.getUserDetails);
router.get("/:id", UserControllers.getSpecificUser);
router.post("/confirmAccount", UserControllers.confirmAccount);
router.post("/resendVerifyToken", UserControllers.resendVerifyToken)
//router.post("/verify", auth, UserControllers.verifyAccount);
//router.post("/resendVerifyEmail",auth, UserControllers.resendVerifyEmail);

module.exports = router;