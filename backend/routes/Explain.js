const express = require("express");
const { explain, saveSolution } = require("../controllers/Explain");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();
router.use(requireAuth);
router.get("/:id", explain);

module.exports = router;
