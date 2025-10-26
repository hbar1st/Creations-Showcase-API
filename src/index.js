const express = require("express");
const AppError = require("./errors/AppError");
// used to create salts or tokens 
// const crypto = require("crypto");

//const passport = require("./middleware/passport");

//const path = require("node:path");
require("dotenv").config();

const app = express();

// allow express to parse the request body
app.use(express.urlencoded({ extended: true })) 

app.use(express.json());

// use cloudinary to upload project images
const cloudinary = require("cloudinary").v2;

function setupCloudinary() {
  console.log("Setting up Cloudinary");
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  // Log the configuration
  console.log(cloudinary.config());
}
setupCloudinary();

// need to initialize passport 
const passport = require("./middleware/passport");
app.use(passport.initialize());

// set up the locals currentUser value before we do any rendering?? (not useful in a REST api? // TODO check into this - maybe not needed)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// TODO setup the root route to explain the api? Think about it (refer to other apis you've used before)
app.get("/", (req, res) => {
  res.send("The Creations Showcase API is an API that lets you showcase your web development projects and receive feedback on them.");
});

// userRouter has the routes that are not strictly REST but needed for login/signup/logout
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
  if (typeof err === AppError) {
    {
      res.status = err.statusCode;
      if (typeof err === ValidationError) {
        res.json({ timestamp: err.timestamp, message: err.details })
      } else {
        res.json({ timestamp: err.timestamp, message: res.message })
      }
      console.log(err, err.stack)
    }
    const timestamp = new Date().toUTCString;
    console.log("================================================")
    console.error('in the catch-all: ', timestamp, err, err.stack)
    if (res.statusCode < 400) {
      res.status(500);
      console.log("TODO: fix up whomever sent this error up here without setting the status?")
      res.json({
        timestamp,
        message: "Internal Server Error. Contact support if this error persists.",
      });
    } else {
      res.json({ timestamp, ...err });
    }
  }
});

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
