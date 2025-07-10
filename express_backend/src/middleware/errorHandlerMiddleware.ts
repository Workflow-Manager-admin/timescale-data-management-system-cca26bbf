import { Request, Response, NextFunction } from 'express';

// PUBLIC_INTERFACE
/**
 * Central error-handling middleware.
 * Formats errors as JSON responses and logs stacktrace to the server log.
 * Passes on error if headers already sent.
 */
export function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  // Log error for diagnostics
  console.error(err.stack || err);

  // Custom error status or default 500
  const status = err.statusCode || err.status || 500;

  // Avoid leaking error details in production, but send message for known/validation errors
  let message =
    status === 500
      ? 'Internal Server Error'
      : err.message || 'An error occurred';

  res.status(status).json({
    status: 'error',
    message,
    // Optionally include stack only in non-prod
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

export default errorHandlerMiddleware;
