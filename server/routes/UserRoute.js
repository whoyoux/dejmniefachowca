const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/UserController');
const auth = require('../middle/auth');
const resizeAvatar = require('../middle/resizeAvatar');
const multer = require('multer');

const multerStorage = multer.memoryStorage();

const upload = multer({
    storage: multerStorage
});

router.post("/register",  UserControllers.registerNewUser);
router.post("/login", UserControllers.loginUser);
router.get("/me", auth, UserControllers.getUserDetails);
router.get("/:id", UserControllers.getSpecificUser);
router.post("/confirmAccount", UserControllers.confirmAccount);
router.post("/resendVerifyToken", UserControllers.resendVerifyToken);
router.post("/uploadAvatar", auth, upload.single('avatar'), resizeAvatar, UserControllers.uploadPhoto);

module.exports = router;