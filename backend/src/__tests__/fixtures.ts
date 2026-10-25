import { jest } from '@jest/globals';
import type { Request, Response } from 'express';
import type QuizRepository from '../repositories/quiz.repository.js';
import type { CreateQuizInput } from '../schemas/quizzes/create.js';

export const quizId = 'edfe0a1e-29e8-4c17-b2cd-cb86c2c95ded';
export const quizInput: CreateQuizInput = {
  title: 'JavaScript basics',
  questions: [
    { type: 'BOOLEAN', text: 'Browser only?', booleanAnswer: false },
    { type: 'INPUT', text: 'Constant keyword?', textAnswer: 'const' },
    {
      type: 'CHECKBOX',
      text: 'Primitive types?',
      options: [
        { text: 'string', isCorrect: true },
        { text: 'boolean', isCorrect: true },
        { text: 'Array', isCorrect: false },
      ],
    },
  ],
};
export const quiz: Awaited<ReturnType<QuizRepository['create']>> = {
  id: quizId,
  title: quizInput.title,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  questions: [
    {
      id: 'q1',
      quizId,
      text: 'Browser only?',
      type: 'BOOLEAN',
      position: 0,
      booleanAnswer: false,
      textAnswer: null,
      options: [],
    },
  ],
};
export function mockHttp() {
  const req = {
    params: { id: quizId },
    body: structuredClone(quizInput),
  } as Request<{ id: string }>;
  const response = {
    headersSent: false,
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  return {
    req,
    response,
    res: response as unknown as Response,
    next: jest.fn(),
  };
}
