const express = require("express");
const { submitFeedback, getFeedback } = require("../controllers/Feedback");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
router.use(requireAuth);
router.get("/", getFeedback);
router.post("/", submitFeedback);

module.exports = router;
