const express = require("express");
const router = express.Router();
const reportController = require("./report.controller");
const validateRequest = require("../../middleware/validateRequest");
const { protect } = require("../../middleware/authMiddleware");
const { createReportSchema } = require("./report.validation");

router.post(
  "/",
  protect,
  validateRequest(createReportSchema),
  reportController.create
);
router.get("/", protect, reportController.getAll);

module.exports = router;