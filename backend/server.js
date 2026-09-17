require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require('./routes/User')
const questionRoutes = require("./routes/Question");
const attemptRoutes = require("./routes/Attempt");
const analyticsRoutes = require("./routes/Analytics");
const bookmarkRoutes = require("./routes/Bookmark");
const feedbackRoutes = require("./routes/Feedback");
const explainRoutes = require("./routes/Explain");

const app = express();

app.use(express.json());
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || "").split(",").filter(Boolean).length
    ? (process.env.CORS_ORIGIN || "").split(",")
    : true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use("/api/user", userRoutes);
app.use("/api", questionRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/explain", explainRoutes);

// Multer / validation errors -> JSON (not HTML)
app.use((err, req, res, next) => {
  if (err) {
    const status = err.code === "LIMIT_FILE_SIZE" ? 400 : 400;
    return res.status(status).json({ error: err.message || "Request failed" });
  }
  next();
});

mongoose
  .connect(process.env.MONGO_URI, {dbName: "PhyJEEcs"})
  .then(() => {
    console.log("connected to database");
    app.listen(process.env.PORT, () => {
      console.log("listening for requests on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });