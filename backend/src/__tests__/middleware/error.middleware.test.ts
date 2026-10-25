import { describe, expect, jest, test } from '@jest/globals';
import { z } from 'zod';
import ApiError from '../../exceptions/api.error.js';
import errorMiddleware from '../../middleware/error.middleware.js';
import { mockHttp } from '../fixtures.js';

describe('error middleware', () => {
  test('forwards errors if headers have already been sent', () => {
    const { req, res, response, next } = mockHttp();
    response.headersSent = true;
    const error = new Error('Late error');
    errorMiddleware(error, req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });
  test('returns the ApiError status and message', () => {
    const { req, res, response, next } = mockHttp();
    errorMiddleware(ApiError.NotFound('Quiz not found'), req, res, next);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: 'Quiz not found',
    });
    expect(next).not.toHaveBeenCalled();
  });
  test('returns readable Zod error paths and messages', () => {
    const { req, res, response, next } = mockHttp();
    const result = z
      .object({
        questions: z.array(z.object({ text: z.string().min(1, 'Required') })),
      })
      .safeParse({ questions: [{ text: '' }] });
    if (result.success) throw new Error('Expected invalid fixture');
    errorMiddleware(result.error, req, res, next);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation error',
      errors: [{ path: 'questions.0.text', message: 'Required' }],
    });
    expect(next).not.toHaveBeenCalled();
  });
  test('returns 400 for malformed JSON from express.json()', () => {
    const { req, res, response, next } = mockHttp();
    const error = Object.assign(new SyntaxError('Unexpected token'), {
      type: 'entity.parse.failed',
    });
    errorMiddleware(error, req, res, next);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid JSON',
    });
    expect(next).not.toHaveBeenCalled();
  });
  test.each([
    new Error('Private database details'),
    new SyntaxError('Internal parser error'),
    Object.assign(new SyntaxError('Internal parser error'), { type: 'other' }),
    'Unexpected thrown string',
    null,
  ])('logs unexpected errors but hides internal details (%#)', (error) => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { req, res, response, next } = mockHttp();
    errorMiddleware(error, req, res, next);
    expect(log).toHaveBeenCalledWith(error);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
