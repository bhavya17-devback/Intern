const express = require('express');
const router = express.Router();
const {
  claimDonation,
  getMyClaims,
  markAsCompleted
} = require('../controllers/claimController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All claim routes require authentication

// NGO only routes
router.post('/:id/claim', authorize('ngo'), claimDonation);
router.get('/my-claims', authorize('ngo'), getMyClaims);

// NGO & Donor routes
router.patch('/:id/complete', authorize('ngo', 'donor'), markAsCompleted);

module.exports = router;