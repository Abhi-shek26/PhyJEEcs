const express = require("express");
const { listBookmarks, toggleBookmark } = require("../controllers/Bookmark");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
router.use(requireAuth);
router.get("/", listBookmarks);
router.post("/", toggleBookmark);

module.exports = router;
