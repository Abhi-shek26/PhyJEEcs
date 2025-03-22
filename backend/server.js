require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./routes/User')
const questionRoutes = require("./routes/Question");


const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api", questionRoutes);

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