

const { validationResult } = require("express-validator");
const ValidationError = require("../errors/ValidationError");

function handleExpressValidationErrors(req, res, next) {
  const errors = validationResult(req);

  console.log("validation ERRORS? ", errors);
  if (!errors.isEmpty()) {
    throw new ValidationError(
      "Action has failed due to some validation errors",
      errors.array()
    );
  } else {
    next();
  }
}

module.exports = { handleExpressValidationErrors}