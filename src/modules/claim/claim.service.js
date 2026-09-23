const Donation = require("../../models/Donation");

const claimDonation = async (donationId, ngoId) => {
  const donation = await Donation.findById(donationId);
  if (!donation) {
    throw new Error("Donation not found");
  }
  if (donation.status !== "Available") {
    throw new Error("Donation is no longer available");
  }

  donation.claimedBy = ngoId;
  donation.status = "Claimed";
  donation.claimedAt = new Date();
  await donation.save();

  return donation;
};

const getMyClaims = async (ngoId) => {
  return await Donation.find({ claimedBy: ngoId }).populate("donor", "name email");
};

const updateClaimStatus = async (donationId, status, ngoId) => {
  const donation = await Donation.findOne({ _id: donationId, claimedBy: ngoId });
  if (!donation) {
    throw new Error("Claim record not found or unauthorized");
  }

  donation.status = status;
  await donation.save();
  return donation;
};

module.exports = {
  claimDonation,
  getMyClaims,
  updateClaimStatus,
};