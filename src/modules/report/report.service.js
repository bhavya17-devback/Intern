const Donation = require("../../models/Donation");

const createReport = async (reportData, userId) => {
  const { donationId, reason, description } = reportData;
  const donation = await Donation.findById(donationId);
  if (!donation) {
    throw new Error("Donation not found");
  }

  donation.reports = donation.reports || [];
  donation.reports.push({
    reportedBy: userId,
    reason,
    description,
    reportedAt: new Date(),
  });

  await donation.save();
  return donation;
};

const getAllReports = async () => {
  return await Donation.find({ "reports.0": { $exists: true } })
    .select("title reports donor")
    .populate("donor", "name email");
};

module.exports = {
  createReport,
  getAllReports,
};