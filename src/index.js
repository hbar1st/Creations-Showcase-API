const express = require("express");
const cors = require("cors");
require("dotenv").config();

const AppError = require("./errors/AppError");
const ValidationError = require("./errors/ValidationError");

const app = express();

// configure cors // TODO read this to setup https://expressjs.com/en/resources/middleware/cors.html#enabling-cors-pre-flight:~:text=%27)%0A%7D)-,Configuring%20CORS,-See%20the%20configuration
/*
const corsOptions = {
origin: "http://example.com",
optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
*/

// enable cors on all routes for now // TODO restrict to your actual client apps
app.use(cors());

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

const INTERNAL_ERROR = "Internal Server Error. Contact support if this error persists."

// catch-all for errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  
  const timestamp = new Date().toUTCString;
  try {
    console.log("================================================");
    console.error("in the catch-all: ", timestamp, err, err.stack);
    if (err instanceof AppError) {
      {
        res.status(err.statusCode);
        if (err instanceof ValidationError) {
          res.json({ timestamp: err.timestamp, message: err.details })
        } else {
          res.json({ timestamp: err.timestamp, message: err.message })
        }
        console.log(err, err.stack)
      } 
      if (res.statusCode < 400) {
        res.status(500);
        console.log("TODO: fix up whomever sent this error up here without setting the status?")
        res.json({
          timestamp,
          message: INTERNAL_ERROR
        });
      } else if (!(err instanceof AppError)) {
        res.json({ timestamp, message: [...err] });
      }
    } else {
      console.log(err, err.stack);
      res.status(500).json({timestamp, message: INTERNAL_ERROR})
    }
  } catch (error) {
    // don't let any error pass thru!
    console.log(error, error.stack);
    res.status(500).json({ timestamp, message: INTERNAL_ERROR });
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
