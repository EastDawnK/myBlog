const express = require("express");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const Company = require("../models/Company");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const router = express.Router();

const buildAffectedCompanies = (body) => {
  const names = Array.isArray(body.affected_company)
    ? body.affected_company
    : [body.affected_company];
  const tickers = Array.isArray(body.affected_ticker)
    ? body.affected_ticker
    : [body.affected_ticker];
  const scores = Array.isArray(body.impact_score)
    ? body.impact_score
    : [body.impact_score];
  const strategies = Array.isArray(body.strategy) ? body.strategy : [body.strategy];
  const comments = Array.isArray(body.comment) ? body.comment : [body.comment];

  return names
    .map((name, index) => ({
      affected_company: name,
      affected_ticker: tickers[index],
      impact_score: Number(scores[index]) || 50,
      strategy: strategies[index],
      comment: comments[index],
    }))
    .filter((company) => company.affected_company && company.affected_company.trim());
};

const buildPostPayload = (body) => ({
  title: body.title,
  summary: body.summary,
  body: body.body,
  influencing_company: body.influencing_company,
  influencing_ticker: body.influencing_ticker,
  eventType: body.eventType,
  eventDate: body.eventDate || undefined,
  earningDate: body.earningDate || undefined,
  earningDateUS: body.earningDateUS || body.earningDate || undefined,
  earningDateKR: body.earningDateKR || undefined,
  earningWhisper: body.earningWhisper,
  consensus: body.consensus,
  revenue: body.revenue,
  influencing_score: Number(body.influencing_score) || 50,
  affected_companies: buildAffectedCompanies(body),
  hbmComment: body.hbmComment,
  dramComment: body.dramComment,
  nandComment: body.nandComment,
  guidanceComment: body.guidanceComment,
  sourceUrl: body.sourceUrl,
});

router.get("/login", (req, res) => {
  res.render("admin/login", {
    locals: {
      title: "Admin Login",
    },
    error: null,
  });
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).render("admin/login", {
        locals: {
          title: "Admin Login",
        },
        error: "아이디 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    req.session.user = {
      id: user._id.toString(),
      username: user.username,
    };

    return res.redirect("/admin");
  })
);

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    res.render("admin/dashboard", {
      locals: {
        title: "Admin Dashboard",
      },
      posts,
    });
  })
);

router.get(
  "/posts/new",
  requireAuth,
  asyncHandler(async (req, res) => {
    const companies = await Company.find().sort({ name: 1 }).lean();

    res.render("admin/new", {
      locals: {
        title: "New Analysis",
      },
      companies,
    });
  })
);

router.post(
  "/posts",
  requireAuth,
  asyncHandler(async (req, res) => {
    await Post.create(buildPostPayload(req.body));
    res.redirect("/admin");
  })
);

router.get(
  "/posts/:id/edit",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [post, companies] = await Promise.all([
      Post.findById(req.params.id).lean(),
      Company.find().sort({ name: 1 }).lean(),
    ]);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    return res.render("admin/edit", {
      locals: {
        title: "Edit Analysis",
      },
      post,
      companies,
    });
  })
);

router.post(
  "/posts/:id/edit",
  requireAuth,
  asyncHandler(async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, buildPostPayload(req.body), {
      runValidators: true,
    });
    res.redirect("/admin");
  })
);

router.post(
  "/posts/:id/delete",
  requireAuth,
  asyncHandler(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  })
);

module.exports = router;
