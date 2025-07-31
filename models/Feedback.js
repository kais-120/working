const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  rating: Number,
  createdAt: Date,
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
