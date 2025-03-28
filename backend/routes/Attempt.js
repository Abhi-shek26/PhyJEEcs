const express = require("express");
const { getUserAttempts } = require("../controllers/Attempt");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getUserAttempts);

module.exports = router;
