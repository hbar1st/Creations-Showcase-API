
import { default as express } from "express";
import cors from  "cors";
import 'dotenv/config'; 
import AppError from "../errors/AppError.js";
import ValidationError from "../errors/ValidationError.js";

const app = express();

app.use(express.urlencoded({ extended: true })) 
app.use(express.json());


app.use(
  cors({
    origin: "*", 
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"]
  })
);



// use cloudinary to upload project images
import { v2 as cloudinary } from "cloudinary";

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
import  passport  from "../middleware/passport.js";
app.use(passport.initialize());

// set up the locals currentUser value before we do any rendering?? (not useful in a REST api? // TODO check into this - maybe not needed)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});



import  indexRouter  from "../routers/indexRouter.js";
app.use("/", indexRouter);

import userRouter from "../routers/userRouter.js";
app.use("/user", userRouter);

import projectRouter from "../routers/projectRouter.js";
app.use("/projects", projectRouter);


// Catch-all for unhandled routes (must be placed last but before error handler)
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `This is a surprising request. I can't find ${req.originalUrl} on this server!`,
  });
});

const INTERNAL_ERROR =
  "Internal Server Error. Contact support if this error persists.";

// catch-all for errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const timestamp = new Date().toUTCString;
  res.set({ "Content-Type": "application/problem+json" }); // this type from https://datatracker.ietf.org/doc/html/rfc7807#section-3
  try {
    console.log("================================================");
    console.error("in the catch-all: ", timestamp, err, err.stack);
    if (err instanceof AppError) {
      {
        res.status(err.statusCode);
        if (err instanceof ValidationError) {
          res.json({
            statusCode: err.statusCode,
            timestamp: err.timestamp,
            message: err.message,
            details: err.details,
          });
        } else {
          res.json({
            statusCode: err.statusCode,
            timestamp: err.timestamp,
            message: err.message,
          });
        }
      }
      if (res.statusCode < 400) {
        res.status(500);
        console.log(
          "TODO: fix up whomever sent this error up here without setting the status?"
        );
        res.json({
          statusCode: 500,
          timestamp,
          message: INTERNAL_ERROR,
        });
      } else if (!(err instanceof AppError)) {
        res.status(500).json({ timestamp, message: INTERNAL_ERROR });
      }
    } else {
      res.status(500).json({ timestamp, message: INTERNAL_ERROR });
    }
  } catch (error) {
    // don't let any error pass thru!
    res.status(500).json({ timestamp, message: INTERNAL_ERROR });
  }
});


export {app}