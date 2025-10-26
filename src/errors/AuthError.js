const AppError = require("./AppError");

class AuthError extends AppError {
  constructor(message='Cannot verify credentails.') {
    super(message, 401);
  }
}
