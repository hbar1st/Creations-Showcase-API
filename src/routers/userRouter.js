const { Router } = require("express");
const { validationResult } = require("express-validator");

const userRouter = Router();

const {
  signUp,
  login,
  logout
} = require("../controllers/userController");


const { validateUserFields } = require("../validators/userValidator");

function handleExpressValidationErrors(req, res, next) {
  const errors = validationResult(req);

  console.log("validation ERRORS? ", errors);
  if (!errors.isEmpty()) {
    res.status(400);
    return next({ "signup-errors": errors.array() }); 
  } else {
    next();
  }
  
}

userRouter
  .route("/sign-up")
  .post((req, res, next) => { console.log("req.body: ", req.body); next(); }, validateUserFields, handleExpressValidationErrors, signUp);

userRouter
  .route("/login")
  .post(login);


userRouter.get("/logout", logout);

module.exports = userRouter;
