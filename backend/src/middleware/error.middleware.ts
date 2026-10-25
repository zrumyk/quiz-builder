import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (
    error instanceof SyntaxError &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  ) {
    res.status(400).json({
      success: false,
      message: 'Invalid JSON',
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export default errorMiddleware;