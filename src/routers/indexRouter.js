//// index.js
const express = require("express");
const indexRouter = express.Router();

const array = [];

indexRouter.get("/", (req, res) => {
  res.status(200).json({
    message:
      "The Creations Showcase API is an API that lets you showcase your web development projects and receive feedback on them.",
  });
});


indexRouter.get("/test", (req, res) => res.json({ array }));

indexRouter.post("/test", (req, res) => {
  array.push(req.body.item);
  res.send("success!");
});

module.exports = indexRouter;
