require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require('./routes/User')
const questionRoutes = require("./routes/Question");
const attemptRoutes = require("./routes/Attempt");

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api", questionRoutes);
app.use("/api/attempts", attemptRoutes);

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