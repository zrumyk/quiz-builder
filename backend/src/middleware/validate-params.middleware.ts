import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

const validateParams = (schema: ZodType): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(result.error);
      return;
    }

    next();
  };
};

export default validateParams;
