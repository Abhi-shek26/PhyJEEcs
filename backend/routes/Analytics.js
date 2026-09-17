const express = require("express");
const { getSummary, getFunnel, getRecommendations, exportCsv } = require("../controllers/Analytics");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
router.use(requireAuth);

router.get("/summary", getSummary);
router.get("/funnel", getFunnel);
router.get("/recommendations", getRecommendations);
router.get("/export.csv", exportCsv);

module.exports = router;
