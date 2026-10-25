import { describe, expect, test } from '@jest/globals';
import { ZodError } from 'zod';
import validateParams from '../../middleware/validate-params.middleware.js';
import { quizParamsSchema } from '../../schemas/quizzes/params.js';
import { mockHttp, quizId } from '../fixtures.js';

describe('validateParams middleware', () => {
  const middleware = validateParams(quizParamsSchema);
  test('accepts a UUID without assigning req.params (Express 5 getter)', () => {
    const { req, res, next } = mockHttp();
    const params = { id: quizId };
    Object.defineProperty(req, 'params', { get: () => params });
    middleware(req, res, next);
    expect(req.params).toBe(params);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
  test.each(['abc', '', '123', '00000000-0000-0000-0000-not-a-uuid'])(
    'rejects invalid id "%s"',
    (id) => {
      const { req, res, response, next } = mockHttp();
      req.params.id = id;
      middleware(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(ZodError));
      expect(response.status).not.toHaveBeenCalled();
    },
  );
});
