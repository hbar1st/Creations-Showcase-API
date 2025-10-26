const { Router } = require("express");
const { validationResult } = require("express-validator");

const userRouter = Router();

const {
  signUp,
  login,
  logout
} = require("../controllers/userController");


const { validateUserFields } = require("../validators/userValidator");

const passport = require("passport");

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
  .post((req, res, next) => { console.log("req.body: ", req.body); next(); }, validateUserFields, handleExpressValidationErrors, signUp, login);

userRouter
  .route("/login")
  .post(passport.authenticate('jwt', { session: false }), login);


// Catch-all for unhandled routes (must be placed last but before error handler)
userRouter.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `I can't find ${req.originalUrl} on this server!`
  })
})

module.exports = userRouter;
