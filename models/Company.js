const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ticker: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    market: {
      type: String,
      required: true,
      trim: true,
    },
    sector: {
      type: String,
      trim: true,
    },
    memo: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
