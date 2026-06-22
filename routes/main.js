const express = require("express");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const { demoPosts } = require("../utils/demoData");

const router = express.Router();
const isDatabaseConnected = () => mongoose.connection.readyState === 1;

router.get(
  ["/", "/home"],
  asyncHandler(async (req, res) => {
    let posts = demoPosts.slice(0, 5);
    let demoMode = true;

    if (isDatabaseConnected()) {
      posts = await Post.find().sort({ createdAt: -1 }).limit(5).lean();
      demoMode = false;
    }

    res.render("index", {
      locals: {
        title: "실적 발표 영향 분석",
      },
      posts,
      demoMode,
    });
  })
);

router.get("/about", (req, res) => {
  res.render("about", {
    locals: {
      title: "프로젝트 소개",
    },
  });
});

module.exports = router;
