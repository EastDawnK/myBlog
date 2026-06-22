require("dotenv").config();

const bcrypt = require("bcrypt");
const dns = require("dns");
const mongoose = require("mongoose");
const Company = require("../models/Company");
const Post = require("../models/Post");
const User = require("../models/User");
const { demoCompanies, demoPosts } = require("../utils/demoData");

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const mongoUri = process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI;

const seed = async () => {
  if (!mongoUri) {
    throw new Error("MONGODB_URI_LOCAL or MONGODB_URI is required.");
  }

  await mongoose.connect(mongoUri);

  const username = process.env.ADMIN_USERNAME || "blogadmin";
  const password = process.env.ADMIN_PASSWORD || "12345";
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findOneAndUpdate(
    { username },
    { username, password: hashedPassword },
    { upsert: true, runValidators: true }
  );

  for (const company of demoCompanies) {
    await Company.findOneAndUpdate(
      { ticker: company.ticker },
      {
        name: company.name,
        ticker: company.ticker,
        market: company.market,
        sector: company.sector,
        memo: company.memo,
      },
      { upsert: true, runValidators: true }
    );
  }

  const demoPost = demoPosts[0];
  await Post.findOneAndUpdate(
    { title: demoPost.title },
    {
      title: demoPost.title,
      summary: demoPost.summary,
      body: demoPost.body,
      influencing_company: demoPost.influencing_company,
      influencing_ticker: demoPost.influencing_ticker,
      eventType: demoPost.eventType,
      eventDate: demoPost.eventDate,
      earningDate: demoPost.earningDate,
      earningDateUS: demoPost.earningDateUS,
      earningDateKR: demoPost.earningDateKR,
      earningWhisper: demoPost.earningWhisper,
      consensus: demoPost.consensus,
      revenue: demoPost.revenue,
      influencing_score: demoPost.influencing_score,
      affected_companies: demoPost.affected_companies,
      hbmComment: demoPost.hbmComment,
      dramComment: demoPost.dramComment,
      nandComment: demoPost.nandComment,
      guidanceComment: demoPost.guidanceComment,
      sourceUrl: demoPost.sourceUrl,
    },
    { upsert: true, runValidators: true }
  );

  await mongoose.disconnect();
  console.log(`Seed complete. Admin login: ${username} / ${password}`);
};

seed().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
