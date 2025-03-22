const express = require("express");
const upload = require("../middleware/multer");
const { uploadQuestion, getQuestions } = require("../controllers/Question");

const router = express.Router();

router.post("/upload", upload.single("image"), uploadQuestion);
router.get("/questions", getQuestions);

module.exports = router;
