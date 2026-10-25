import { describe, expect, test } from '@jest/globals';
import { ZodError } from 'zod';
import validate from '../../middleware/validate.middleware.js';
import { createQuizSchema } from '../../schemas/quizzes/create.js';
import { mockHttp, quizInput } from '../fixtures.js';

describe('validate middleware', () => {
  const middleware = validate(createQuizSchema);
  test('accepts all question types, false answers and multiple correct options', () => {
    const { req, res, next } = mockHttp();
    middleware(req, res, next);
    expect(req.body).toEqual(quizInput);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
  test('stores trimmed validated data in req.body', () => {
    const { req, res, next } = mockHttp();
    req.body = {
      title: '  Trim me  ',
      questions: [
        { type: 'INPUT', text: ' Question? ', textAnswer: ' answer ' },
      ],
    };
    middleware(req, res, next);
    expect(req.body).toEqual({
      title: 'Trim me',
      questions: [{ type: 'INPUT', text: 'Question?', textAnswer: 'answer' }],
    });
    expect(next).toHaveBeenCalledWith();
  });
  const invalidBodies: [string, unknown][] = [
    ['missing body', undefined],
    ['blank title', { ...quizInput, title: ' ' }],
    ['no questions', { ...quizInput, questions: [] }],
    [
      'unknown question type',
      { title: 'Quiz', questions: [{ type: 'OTHER', text: 'Question' }] },
    ],
    [
      'blank question',
      {
        title: 'Quiz',
        questions: [{ type: 'BOOLEAN', text: ' ', booleanAnswer: true }],
      },
    ],
    [
      'missing Boolean answer',
      { title: 'Quiz', questions: [{ type: 'BOOLEAN', text: 'Question' }] },
    ],
    [
      'string Boolean answer',
      {
        title: 'Quiz',
        questions: [
          { type: 'BOOLEAN', text: 'Question', booleanAnswer: 'false' },
        ],
      },
    ],
    [
      'blank Input answer',
      {
        title: 'Quiz',
        questions: [{ type: 'INPUT', text: 'Question', textAnswer: ' ' }],
      },
    ],
    [
      'extra answer field',
      {
        title: 'Quiz',
        questions: [
          {
            type: 'BOOLEAN',
            text: 'Question',
            booleanAnswer: true,
            textAnswer: 'unexpected',
          },
        ],
      },
    ],
    [
      'only one option',
      {
        title: 'Quiz',
        questions: [
          {
            type: 'CHECKBOX',
            text: 'Question',
            options: [{ text: 'A', isCorrect: true }],
          },
        ],
      },
    ],
    [
      'no correct options',
      {
        title: 'Quiz',
        questions: [
          {
            type: 'CHECKBOX',
            text: 'Question',
            options: [
              { text: 'A', isCorrect: false },
              { text: 'B', isCorrect: false },
            ],
          },
        ],
      },
    ],
    [
      'blank option',
      {
        title: 'Quiz',
        questions: [
          {
            type: 'CHECKBOX',
            text: 'Question',
            options: [
              { text: ' ', isCorrect: true },
              { text: 'B', isCorrect: false },
            ],
          },
        ],
      },
    ],
  ];
  test.each(invalidBodies)(
    'forwards one validation error for %s',
    (_name, body) => {
      const { req, res, response, next } = mockHttp();
      req.body = body;
      middleware(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(ZodError));
      expect(req.body).toBe(body);
      expect(response.status).not.toHaveBeenCalled();
    },
  );
});
