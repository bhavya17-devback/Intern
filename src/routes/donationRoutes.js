const express = require('express');
const router = express.Router();
const {
  createDonation,
  getAllDonations,
  getDonationById,
  getMyDonations
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public / Protected Routes
router.get('/', getAllDonations);
router.get('/my-donations', protect, authorize('donor'), getMyDonations);
router.get('/:id', getDonationById);
router.post('/', protect, authorize('donor'), createDonation);

module.exports = router;