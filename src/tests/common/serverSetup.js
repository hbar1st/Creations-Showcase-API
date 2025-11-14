

import indexRouter from "../../routers/indexRouter";
import { default as express } from "express";
import cors from  "cors";
import 'dotenv/config'; 

const app = express();

app.use(express.urlencoded({ extended: true })) 
app.use(express.json());

app.use("/", indexRouter);

app.use(
  cors({
    origin: "*", 
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"]
  })
);


import userRouter from "../../routers/userRouter";
app.use("/user", userRouter);

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
const passport = require("../../middleware/passport");
app.use(passport.initialize());

// set up the locals currentUser value before we do any rendering?? (not useful in a REST api? // TODO check into this - maybe not needed)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


export {app}