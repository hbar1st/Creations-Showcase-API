const AppError = require("./AppError");

// the details is an array of errors (an accumulation of all of them)
class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400);
    this.details = details; // Additional validation details
  }
}

module.exports = ValidationError;