//// index.js
const express = require("express");
const index = express.Router();

const array = [];

index.get("/", (req, res) => {
  res.status(200).json({
    message: "The Creations Showcase API is an API that lets you showcase your web development projects and receive feedback on them."
  });
});


index.get("/test", (req, res) => res.json({ array }));

index.post("/test", (req, res) => {
  array.push(req.body.item);
  res.send("success!");
});

module.exports = index;
