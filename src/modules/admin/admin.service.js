const User = require("../../models/User");
const Donation = require("../../models/Donation");

const registerAdmin = async (adminData) => {
  const existingUser = await User.findOne({ email: adminData.email });
  if (existingUser) {
    throw new Error("Admin with this email already exists");
  }

  const admin = new User({
    ...adminData,
    role: "Admin",
  });

  await admin.save();
  return admin;
};

const getPendingNgos = async () => {
  return await User.find({
    role: { $regex: /^ngo$/i },
    $or: [
      { status: { $regex: /^pending$/i } },
      { isVerified: false },
      { isVerified: { $exists: false } }
    ]
  }).select("-password");
};

const updateNgoStatus = async (ngoId, inputStatus = "active") => {
  const ngo = await User.findById(ngoId);
  if (!ngo || !["NGO", "ngo"].includes(ngo.role)) {
    throw new Error("NGO not found");
  }

  const normalized = String(inputStatus).trim().toLowerCase();
  const targetStatus = (normalized === "approved" || normalized === "active") ? "active" : inputStatus;

  ngo.status = targetStatus;
  ngo.isVerified = (targetStatus === "active");
  
  await ngo.save();
  return ngo;
};

const adminClaimDonation = async (donationId, adminId) => {
  const donation = await Donation.findById(donationId);
  if (!donation) {
    throw new Error("Donation not found");
  }

  if (donation.status === "Claimed") {
    throw new Error("Donation is already claimed");
  }

  donation.status = "Claimed";
  donation.claimedBy = adminId;
  await donation.save();

  return donation;
};

const getPlatformStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalDonations = await Donation.countDocuments();
  const claimedDonations = await Donation.countDocuments({ status: "Claimed" });
  const completedDonations = await Donation.countDocuments({ status: "Completed" });

  return {
    totalUsers,
    totalDonations,
    claimedDonations,
    completedDonations,
  };
};

// --- PHASE 5 METHODS ---

const getAllUsers = async () => {
  return await User.find().select("-password");
};

const updateUserStatus = async (userId, inputStatus) => {
  if (!inputStatus) {
    throw new Error("Status is required");
  }

  const rawStatus = String(inputStatus).trim().toLowerCase();
  
  let targetStatus = rawStatus;
  if (rawStatus === "approved") {
    targetStatus = "active";
  }

  // Schema validations ko bypass karne ke liye findByIdAndUpdate apply kar rahe hain
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { 
      $set: { 
        status: targetStatus,
        ...(targetStatus === "active" ? { isVerified: true } : {})
      } 
    },
    { new: true, runValidators: false }
  ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

module.exports = {
  registerAdmin,
  getPendingNgos,
  updateNgoStatus,
  adminClaimDonation,
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
};