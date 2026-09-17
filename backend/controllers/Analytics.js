const mongoose = require("mongoose");
const Attempt = require("../models/Attempt");
const Question = require("../models/Question");
const Bookmark = require("../models/Bookmark");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

// GET /api/analytics/summary — DA: KPIs + chapter/type/difficulty breakdown + 14-day trend
exports.getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [overall] = await Attempt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
          avgTime: { $avg: "$timeTaken" },
        },
      },
    ]);

    const byChapter = await Attempt.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "questions",
          localField: "questionId",
          foreignField: "_id",
          as: "q",
        },
      },
      { $unwind: "$q" },
      {
        $group: {
          _id: { chapter: "$q.chapter", category: "$q.category" },
          attempted: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
          avgTime: { $avg: "$timeTaken" },
        },
      },
      {
        $project: {
          _id: 0,
          chapter: "$_id.chapter",
          category: "$_id.category",
          attempted: 1,
          correct: 1,
          accuracy: {
            $cond: [{ $eq: ["$attempted", 0] }, 0, { $divide: ["$correct", "$attempted"] }],
          },
          avgTime: { $round: ["$avgTime", 1] },
        },
      },
      { $sort: { accuracy: 1 } },
    ]);

    const byType = await Attempt.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "questions",
          localField: "questionId",
          foreignField: "_id",
          as: "q",
        },
      },
      { $unwind: "$q" },
      {
        $group: {
          _id: "$q.type",
          attempted: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          attempted: 1,
          correct: 1,
          accuracy: {
            $cond: [{ $eq: ["$attempted", 0] }, 0, { $divide: ["$correct", "$attempted"] }],
          },
        },
      },
    ]);

    const byDifficulty = await Attempt.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "questions",
          localField: "questionId",
          foreignField: "_id",
          as: "q",
        },
      },
      { $unwind: "$q" },
      {
        $group: {
          _id: "$q.difficulty",
          attempted: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          difficulty: "$_id",
          attempted: 1,
          correct: 1,
          accuracy: {
            $cond: [{ $eq: ["$attempted", 0] }, 0, { $divide: ["$correct", "$attempted"] }],
          },
        },
      },
    ]);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    const trend = await Attempt.aggregate([
      { $match: { userId, attemptedAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$attemptedAt" } },
          attempted: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
      { $project: { _id: 0, date: "$_id", attempted: 1, correct: 1 } },
      { $sort: { date: 1 } },
    ]);

    const total = overall?.total || 0;
    const correct = overall?.correct || 0;

    // Streak: consecutive days with >=1 attempt ending today/yesterday
    const days = await Attempt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$attemptedAt" } },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 60 },
    ]);
    const daySet = new Set(days.map((d) => d._id));
    let streak = 0;
    const cursor = new Date();
    if (!daySet.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
    while (daySet.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const [bookmarks, feedbacks] = await Promise.all([
      Bookmark.countDocuments({ userId: req.user._id }),
      Feedback.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      kpis: {
        total,
        correct,
        accuracy: total ? correct / total : 0,
        avgTime: Math.round((overall?.avgTime || 0) * 10) / 10,
        streak,
        bookmarks,
        feedbacks,
      },
      byChapter,
      byType,
      byDifficulty,
      trend,
      weakestChapters: byChapter.slice(0, 5),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics/funnel — PA: activation / retention / engagement proxy (per-user + global if admin)
exports.getFunnel = async (req, res) => {
  try {
    const userId = req.user._id;
    const myAttempts = await Attempt.countDocuments({ userId });
    const first = await Attempt.findOne({ userId }).sort({ attemptedAt: 1 });
    const distinctDays = await Attempt.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$attemptedAt" } } } },
      { $count: "days" },
    ]);

    let global = null;
    if (req.user.isAdmin) {
      const [users, attempts, activeUsers] = await Promise.all([
        User.countDocuments({}),
        Attempt.countDocuments({}),
        Attempt.distinct("userId").then((a) => a.length),
      ]);
      const byYear = await User.aggregate([
        {
          $lookup: {
            from: "attempts",
            localField: "_id",
            foreignField: "userId",
            as: "attempts",
          },
        },
        {
          $group: {
            _id: "$year",
            users: { $sum: 1 },
            totalAttempts: { $sum: { $size: "$attempts" } },
          },
        },
      ]);
      global = { users, attempts, activeUsers, activationRate: users ? activeUsers / users : 0, byYear };
    }

    res.json({
      me: {
        attempted: myAttempts,
        activated: myAttempts > 0,
        powerUser: myAttempts >= 10,
        activeDays: distinctDays[0]?.days || 0,
        firstAttemptAt: first?.attemptedAt || null,
      },
      global,
      isAdmin: !!req.user.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics/recommendations — AI (rule-based): weakest chapters + spaced repetition
exports.getRecommendations = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const weak = await Attempt.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "questions",
          localField: "questionId",
          foreignField: "_id",
          as: "q",
        },
      },
      { $unwind: "$q" },
      {
        $group: {
          _id: "$q.chapter",
          attempted: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
      {
        $project: {
          chapter: "$_id",
          _id: 0,
          attempted: 1,
          accuracy: {
            $cond: [{ $eq: ["$attempted", 0] }, 0, { $divide: ["$correct", "$attempted"] }],
          },
        },
      },
      { $match: { attempted: { $gte: 2 } } },
      { $sort: { accuracy: 1 } },
      { $limit: 3 },
    ]);

    const attemptedIds = await Attempt.find({ userId: req.user._id }).distinct("questionId");

    // Priority 1: un-attempted questions from weakest chapters
    let recs = [];
    if (weak.length) {
      recs = await Question.find({
        _id: { $nin: attemptedIds },
        chapter: { $in: weak.map((w) => w.chapter) },
      })
        .select("title chapter category type difficulty imageUrl")
        .limit(10);
    }
    // Priority 2: spaced repetition — incorrect attempts older than 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const review = await Attempt.find({
      userId: req.user._id,
      isCorrect: false,
      attemptedAt: { $lte: threeDaysAgo },
    })
      .populate("questionId", "title chapter category type difficulty imageUrl")
      .limit(5);

    // Priority 3 fallback: any un-attempted
    if (!recs.length) {
      recs = await Question.find({ _id: { $nin: attemptedIds } })
        .select("title chapter category type difficulty imageUrl")
        .limit(10);
    }

    res.json({
      weakestChapters: weak,
      recommended: recs,
      reviewDue: review.map((r) => r.questionId).filter(Boolean),
      strategy: "weakest-chapter-first + spaced-repetition(incorrect older than 3d)",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics/export.csv — DA: raw data export for EDA in Python/Excel
exports.exportCsv = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id })
      .sort({ attemptedAt: -1 })
      .populate("questionId", "title chapter category type difficulty")
      .lean();
    const rows = [
      "attemptedAt,questionCode,chapter,category,type,difficulty,isCorrect,timeTaken,userAnswer",
    ];
    for (const a of attempts) {
      const q = a.questionId || {};
      rows.push(
        [
          new Date(a.attemptedAt).toISOString(),
          q.title || "",
          `"${(q.chapter || "").replace(/"/g, "")}"`,
          q.category || "",
          q.type || "",
          q.difficulty || "",
          a.isCorrect ? 1 : 0,
          a.timeTaken ?? 0,
          `"${String(Array.isArray(a.userAnswer) ? a.userAnswer.join("|") : a.userAnswer ?? "").replace(/"/g, "")}"`,
        ].join(",")
      );
    }
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=phyjeecs-attempts.csv");
    res.send(rows.join("\n"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
