const Donation = require('../models/Donation');

// @desc    Claim an available donation
// @route   POST /api/claims/:id/claim
// @access  Private (NGO only)
exports.claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ message: `Cannot claim. Donation status is already '${donation.status}'` });
    }

    // Update status and attach NGO user ID
    donation.status = 'claimed';
    donation.claimedBy = req.user._id || req.user.id;
    await donation.save();

    res.status(200).json({ success: true, message: 'Donation claimed successfully', donation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all donations claimed by logged-in NGO
// @route   GET /api/claims/my-claims
// @access  Private (NGO only)
exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Donation.find({ claimedBy: req.user._id || req.user.id })
      .populate('donor', 'name phone email')
      .sort({ updatedAt: -1 });

    res.status(200).json({ count: claims.length, claims });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark donation as completed (Food distribution done)
// @route   PATCH /api/claims/:id/complete
// @access  Private (NGO or Donor)
exports.markAsCompleted = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'claimed') {
      return res.status(400).json({ message: 'Only claimed donations can be marked as completed' });
    }

    // Authorization Check: Only associated donor or claiming NGO can complete
    const userId = req.user._id || req.user.id;
    const isDonor = donation.donor.toString() === userId.toString();
    const isClaimer = donation.claimedBy && donation.claimedBy.toString() === userId.toString();

    if (!isDonor && !isClaimer) {
      return res.status(403).json({ message: 'Not authorized to mark this donation as completed' });
    }

    donation.status = 'completed';
    await donation.save();

    res.status(200).json({ success: true, message: 'Donation marked as completed', donation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};