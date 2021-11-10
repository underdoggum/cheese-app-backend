// dependencies
require("dotenv").config();
const { PORT, DATABASE_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");


// database connection
mongoose.connect(DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection
  .on("open", () => console.log("Connected to Mongo"))
  .on("close", () => console.log("Disconnected from Mongo"))
  .on("error", error => console.log(error));


// model
const cheeseSchema = new mongoose.Schema({
  name: String,
  countryOfOrigin: String,
  image: String,
});

const Cheese = mongoose.model("Cheese", cheeseSchema);


// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


// ROUTES
// test route
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// index route
app.get("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

// create route
app.post("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.create(req.body));
  } catch (error) {
    res.status(400).json(error);
  }
});

// update route
app.put("/cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json(error);
  }
});

// destroy route
app.delete("/cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});





// Listener
app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
