const express = require("express");
const upload = require("../middleware/multer");
const { uploadQuestion, getQuestions, attemptQuestion, } = require("../controllers/Question");
const { saveSolution } = require("../controllers/Explain");
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');


const router = express.Router();

router.use(requireAuth);

router.post("/upload", requireAdmin, upload.single("image"), uploadQuestion);
router.get("/questions", getQuestions);
router.post("/attempt", attemptQuestion);
router.patch("/questions/:id/solution", requireAdmin, saveSolution);

module.exports = router;
