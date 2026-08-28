const User = require('../models/User');

// ==========================================
// 28 AUG FEATURES: NGO VERIFICATION
// ==========================================

// @desc    Get all pending NGO registrations
// @route   GET /api/admin/ngos/pending
// @access  Private (Admin)
exports.getPendingNgos = async (req, res) => {
  try {
    const pendingNgos = await User.find({ role: 'ngo', status: 'pending' }).select('-password');
    res.status(200).json({ count: pendingNgos.length, pendingNgos });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify/Approve NGO registration
// @route   PATCH /api/admin/ngos/:id/verify
// @access  Private (Admin)
exports.verifyNgo = async (req, res) => {
  try {
    const ngo = await User.findById(req.params.id);

    if (!ngo || ngo.role !== 'ngo') {
      return res.status(404).json({ message: 'NGO not found' });
    }

    ngo.status = 'active';
    await ngo.save();

    res.status(200).json({ message: 'NGO verified and activated successfully', ngo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 31 AUG FEATURES: EXTENDED USER MANAGEMENT
// ==========================================

// @desc    Get all users with optional role filter (?role=ngo or ?role=donor)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let filter = {};

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update any user status (active / blocked / pending)
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['active', 'blocked', 'pending'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value. Allowed: active, blocked, pending' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a user permanently
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};