const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const { auth } = require("../middleware/authMiddleware"); 
const { isAdmin } = require("../middleware/permissionMiddleware");

router.get("/daily", auth, isAdmin, reportController.getDailyReport);

module.exports = router;
