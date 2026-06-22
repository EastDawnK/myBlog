const mongoose = require("mongoose");

const affectedCompanySchema = new mongoose.Schema(
  {
    affected_company: {
      type: String,
      required: true,
      trim: true,
    },
    affected_ticker: {
      type: String,
      trim: true,
      uppercase: true,
    },
    impact_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    strategy: {
      type: String,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    influencing_company: {
      type: String,
      required: true,
      trim: true,
    },
    influencing_ticker: {
      type: String,
      trim: true,
      uppercase: true,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
    },
    earningDate: {
      type: Date,
    },
    earningDateUS: {
      type: Date,
    },
    earningDateKR: {
      type: Date,
    },
    earningWhisper: {
      type: String,
      trim: true,
    },
    consensus: {
      type: String,
      trim: true,
    },
    revenue: {
      type: String,
      trim: true,
    },
    influencing_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    affected_companies: [affectedCompanySchema],
    hbmComment: {
      type: String,
      trim: true,
    },
    dramComment: {
      type: String,
      trim: true,
    },
    nandComment: {
      type: String,
      trim: true,
    },
    guidanceComment: {
      type: String,
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
