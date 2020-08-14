const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

router.post("/", reportController.createNewReport);

module.exports = router;
