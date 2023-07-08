import ErrorResponse from "../Utils/errorResponse.js";

 const errorHandler = (err: any, req: any, res: any, next: any) => {
  let error = { ...err };
  error.message = err.message

  console.log(error);

  // In mongoose, 11000 means a duplicate key error
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error is called "ValidationError"
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors as Record<string, any>).map((val) => val.message);
    error = new ErrorResponse(message.join(", "), 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
  });
};

export default errorHandler;


