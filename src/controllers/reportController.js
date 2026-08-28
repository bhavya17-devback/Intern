const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Get platform aggregate stats & reports
// @route   GET /api/reports/summary
// @access  Private (Admin only)
exports.getPlatformReports = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const totalClaimed = await Donation.countDocuments({ status: 'claimed' });
    const totalAvailable = await Donation.countDocuments({ status: 'available' });
    const activeNgos = await User.countDocuments({ role: 'ngo', status: 'active' });
    const pendingNgos = await User.countDocuments({ role: 'ngo', status: 'pending' });

    // Category-wise food aggregate breakdown
    const categoryBreakdown = await Donation.aggregate([
      {
        $group: {
          _id: '$category',
          totalCount: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDonations,
        totalClaimed,
        totalAvailable,
        activeNgos,
        pendingNgos
      },
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};