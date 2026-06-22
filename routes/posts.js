const express = require("express");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const { demoPosts, findDemoPost } = require("../utils/demoData");

const router = express.Router();
const isDatabaseConnected = () => mongoose.connection.readyState === 1;

router.get(
  "/",
  asyncHandler(async (req, res) => {
    let posts = demoPosts;
    let demoMode = true;

    if (isDatabaseConnected()) {
      posts = await Post.find().sort({ createdAt: -1 }).lean();
      demoMode = false;
    }

    res.render("posts/list", {
      locals: {
        title: "실적 이벤트 분석글",
      },
      posts,
      demoMode,
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    let post = findDemoPost(req.params.id);
    let demoMode = Boolean(post);

    if (isDatabaseConnected() && mongoose.Types.ObjectId.isValid(req.params.id)) {
      post = await Post.findById(req.params.id).lean();
      demoMode = false;
    }

    if (!post) {
      return res.status(404).send("Post not found");
    }

    return res.render("posts/detail", {
      locals: {
        title: post.title,
      },
      post,
      demoMode,
    });
  })
);

module.exports = router;
