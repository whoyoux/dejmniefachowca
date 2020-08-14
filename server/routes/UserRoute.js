const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userController");
const auth = require("../middle/auth");
const resizeAvatar = require("../middle/resizeAvatar");
const multer = require("multer");

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

router.post("/register", userControllers.registerNewUser);
router.post("/login", userControllers.loginUser);
router.get("/me", auth, userControllers.getUserDetails);
router.get("/:id", userControllers.getSpecificUser);
router.post("/confirmAccount", userControllers.confirmAccount);
router.post("/resendVerifyToken", userControllers.resendVerifyToken);
router.post(
  "/uploadAvatar",
  auth,
  upload.single("avatar"),
  resizeAvatar,
  userControllers.uploadPhoto
);

module.exports = router;
