const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the donation'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['cooked_food', 'raw_ration', 'packaged_food', 'clothes', 'essentials', 'other'],
      default: 'cooked_food',
    },
    quantity: {
      type: String,
      required: [true, 'Please specify quantity (e.g., 20 plates, 5 kg, 10 packets)'],
    },
    expiryTime: {
      type: Date,
      required: [true, 'Please specify expiry date and time'],
    },
    pickupAddress: {
      type: String,
      required: [true, 'Please provide the pickup address'],
    },
    city: {
      type: String,
      required: [true, 'Please specify the city'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'claimed', 'completed', 'expired', 'cancelled'],
      default: 'available',
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Donation', donationSchema);