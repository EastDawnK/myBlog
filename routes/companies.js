const express = require("express");
const asyncHandler = require("express-async-handler");
const Company = require("../models/Company");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const companies = await Company.find().sort({ name: 1 }).lean();

    res.render("admin/companies", {
      locals: {
        title: "Companies",
      },
      companies,
    });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    await Company.create({
      name: req.body.name,
      ticker: req.body.ticker,
      market: req.body.market,
      sector: req.body.sector,
      memo: req.body.memo,
    });

    res.redirect("/admin/companies");
  })
);

router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    await Company.findByIdAndDelete(req.params.id);
    res.redirect("/admin/companies");
  })
);

module.exports = router;
