const express = require('express');
const router = express.Router();
const { getPlatformReports } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/summary', getPlatformReports);

module.exports = router;