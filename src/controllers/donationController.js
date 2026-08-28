const Donation = require('../models/Donation');

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private (Donor)
exports.createDonation = async (req, res) => {
  try {
    const donationData = {
      ...req.body,
      donor: req.user._id || req.user.id
    };

    const donation = await Donation.create(donationData);
    res.status(201).json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all available donations (with Category, City Regex & Search Filters)
// @route   GET /api/donations?category=cooked_food&city=surat&search=roti
// @access  Public / Private
exports.getAllDonations = async (req, res) => {
  try {
    const { category, city, search } = req.query;
    let query = { status: 'available' };

    // 1. Filter by Category
    if (category) {
      query.category = category;
    }

    // 2. Case-Insensitive City Search using Regex
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // 3. Keyword Search in Title or Pickup Address
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { pickupAddress: { $regex: search, $options: 'i' } }
      ];
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Public / Private
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donor', 'name phone email');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.status(200).json({ donation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged-in donor's donations
// @route   GET /api/donations/my-donations
// @access  Private (Donor)
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id || req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};