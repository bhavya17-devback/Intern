const Donation = require("../../models/Donation");

const createDonation = async (donationData, donorId) => {
  return await Donation.create({
    ...donationData,
    donor: donorId,
    status: "Available",
  });
};

const getAllDonations = async (filters) => {
  const query = { status: "Available" };

  if (filters.category) {
    // Exact & case-insensitive category match (handles 'cooked_food', 'cooked food', etc.)
    const categoryPattern = filters.category.replace(/_/g, "[\\s_]?");
    query.category = new RegExp(`^${categoryPattern}$`, "i");
  }

  if (filters.city) {
    query.city = new RegExp(filters.city, "i");
  }

  return await Donation.find(query).populate("donor", "name email");
};

const searchDonations = async (keyword) => {
  if (!keyword) {
    return await Donation.find({ status: "Available" }).populate("donor", "name email");
  }

  const regex = new RegExp(keyword, "i");

  return await Donation.find({
    status: "Available",
    $or: [
      { itemName: regex },
      { description: regex },
      { category: regex },
      { city: regex },
      { title: regex } // Backward compatibility for older test data
    ],
  }).populate("donor", "name email");
};

const getMyDonations = async (donorId) => {
  return await Donation.find({ donor: donorId });
};

const claimDonation = async (donationId, userId) => {
  const donation = await Donation.findById(donationId);

  if (!donation) {
    throw new Error("Donation not found");
  }

  if (donation.status === "Claimed") {
    throw new Error("Donation is already claimed");
  }

  if (donation.donor.toString() === userId.toString()) {
    throw new Error("You cannot claim your own donation");
  }

  donation.status = "Claimed";
  donation.claimedBy = userId;
  await donation.save();

  return donation;
};

const getMyClaims = async (userId) => {
  return await Donation.find({ claimedBy: userId }).populate("donor", "name email");
};

module.exports = {
  createDonation,
  getAllDonations,
  searchDonations,
  getMyDonations,
  claimDonation,
  getMyClaims,
};