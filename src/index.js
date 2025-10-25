const express = require("express");

// used to create salts or tokens 
const crypto = require("crypto");

const passport = require("./middleware/passport");

const path = require("node:path");
require("dotenv").config();


const app = express();

// allow express to parse the request body
app.use(express.urlencoded({ extended: true })) 

// use cloudinary to upload project images
const cloudinary = require("cloudinary").v2;

async function setupCloudinary() {
  console.log("Setting up Cloudinary");

  await cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Log the configuration
  console.log(cloudinary.config());
}
setupCloudinary();


const MS_IN_24_HRS = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

// eslint-disable-next-line no-undef
if (!process.env.SECRET_TOKEN) {
  console.log("found no session secret in .env, so must create one");
  const b = crypto.randomBytes(40); // any number over 32 is fine
  console.log(
    `Setup the SECRET_TOKEN value in .env with: ${b.toString("hex")}`
  );
  throw new Error("Failed to find a session secret in .env");
}


//app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.send("The Creations Showcase API is an API that lets you showcase your web development projects and receive feedback on them.");
});

const userRouter = require("./routers/userRouter");
app.use("/user", userRouter);

// Catch-all for unhandled routes (must be placed last but before error handler)
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `This is a surprising request. I can't find ${req.originalUrl} on this server!`
  })
})

// catch-all for errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (res.status === 401) {
    console.log('user tried to do something without being authenticated, tell them!')
  }
  const timestamp = new Date().toUTCString;
  console.log("================================================")
  console.error('in the catch-all: ', err, err.stack)
  if (res.statusCode < 400) {
    res.status(500);
    console.log("TODO: fix up whomever sent this error up here without setting the status?")
    res.json({
      message: "Internal Server Error. Contact support if this error persists.",
      timestamp
    });
  } else {
    res.json({ timestamp, ...err });
  }
})

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`)
  } else {
    console.error('Server startup error:', err)
  }
  process.exit(1) // Exit the process if a critical error occurs
})
