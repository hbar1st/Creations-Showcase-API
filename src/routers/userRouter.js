// Routes belonging to /user

const { Router } = require("express");
const { validationResult } = require("express-validator");

const ValidationError = require("../errors/ValidationError");
const userRouter = Router();

const {
  signUp,
  login,
  updateUser,
  deleteUser,
} = require("../controllers/userController");


const {
  validateUserFields,
  validateOptionalUserFields,
} = require("../validators/userValidator");

const passport = require("passport");

function handleExpressValidationErrors(req, res, next) {
  const errors = validationResult(req);
  
  console.log("validation ERRORS? ", errors);
  if (!errors.isEmpty()) {
    throw new ValidationError("sign-up has failed due to some errors", errors.array());
  } else {
    next();
  }
  
}

userRouter
.route("/sign-up")
.post(validateUserFields, handleExpressValidationErrors, signUp);

userRouter
.route("/login")
.post(login);

userRouter
  .route("/")
  .put(passport.authenticate("jwt", { session: false }), validateOptionalUserFields)
  .delete(passport.authenticate("jwt", { session: false }), deleteUser);


module.exports = userRouter;
