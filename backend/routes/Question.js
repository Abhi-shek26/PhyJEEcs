const express = require("express");
const upload = require("../middleware/multer");
const { uploadQuestion, getQuestions, attemptQuestion, } = require("../controllers/Question");
const requireAuth = require('../middleware/requireAuth');


const router = express.Router();

router.use(requireAuth);

router.post("/upload", upload.single("image"), uploadQuestion);
router.get("/questions", getQuestions);
router.post("/attempt", attemptQuestion);

module.exports = router;
