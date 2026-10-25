import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { Request } from 'express';
import QuizController from '../../controllers/quiz.controller.js';
import type QuizService from '../../services/quiz.service.js';
import type { CreateQuizInput } from '../../schemas/quizzes/create.js';
import { mockHttp, quiz, quizId, quizInput } from '../fixtures.js';

describe('QuizController', () => {
  const service = {
    create: jest.fn<QuizService['create']>(),
    findAll: jest.fn<QuizService['findAll']>(),
    find: jest.fn<QuizService['find']>(),
    delete: jest.fn<QuizService['delete']>(),
  };
  let controller: QuizController;
  beforeEach(() => {
    jest.resetAllMocks();
    controller = new QuizController(service);
  });

  test('returns 201 and created quiz data', async () => {
    const { req, res, response, next } = mockHttp();
    service.create.mockResolvedValue(quiz);
    await controller.create(
      req as unknown as Request<
        Record<string, never>,
        unknown,
        CreateQuizInput
      >,
      res,
      next,
    );
    expect(service.create).toHaveBeenCalledWith(quizInput);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({ success: true, data: quiz });
    expect(next).not.toHaveBeenCalled();
  });
  test('returns 200 and a list including question counts', async () => {
    const { req, res, response, next } = mockHttp();
    const data = [{ id: quizId, title: quiz.title, questionCount: 3 }];
    service.findAll.mockResolvedValue(data);
    await controller.findAll(req, res, next);
    expect(service.findAll).toHaveBeenCalledWith();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ success: true, data });
    expect(next).not.toHaveBeenCalled();
  });
  test('returns 200 and details for the requested id', async () => {
    const { req, res, response, next } = mockHttp();
    service.find.mockResolvedValue(quiz);
    await controller.find(req, res, next);
    expect(service.find).toHaveBeenCalledWith(quizId);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ success: true, data: quiz });
    expect(next).not.toHaveBeenCalled();
  });
  test('returns 204 without a body after deletion', async () => {
    const { req, res, response, next } = mockHttp();
    service.delete.mockResolvedValue(undefined);
    await controller.delete(req, res, next);
    expect(service.delete).toHaveBeenCalledWith(quizId);
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).toHaveBeenCalledWith();
    expect(response.json).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
  test.each(['create', 'findAll', 'find', 'delete'] as const)(
    'forwards %s failures once without sending a response',
    async (method) => {
      const { req, res, response, next } = mockHttp();
      const error = new Error('Service failure');
      service[method].mockRejectedValue(error);
      if (method === 'create') {
        await controller.create(
          req as unknown as Request<
            Record<string, never>,
            unknown,
            CreateQuizInput
          >,
          res,
          next,
        );
      } else await controller[method](req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(response.send).not.toHaveBeenCalled();
    },
  );
});
