// If there is an error, it wont get get consoled into the server console, but will be processed by
// this middleware and a response will be send to the client with the error info.
// the stack trace is only send if the project is in "dev"(development) mode and not in "prod"(production)
const errorHandler = (err, req, res, next) => {
  const statusCode =
    req.statusCode == 200 ? 500 : res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    result: "error",
    message: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
