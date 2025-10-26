class AppError extends Error {
  constructor(message, statusCode, stackTrace, cause) {
    super(message, { cause });
    this.statusCode = statusCode;
    this.stackTrace = stackTrace;
    
    // So the error is neat when stringified. AppError: message instead of Error: message
    this.name = "AppError";
  }
}

module.exports = AppError;
