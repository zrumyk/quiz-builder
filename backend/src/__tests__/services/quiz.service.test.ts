import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import QuizService from '../../services/quiz.service.js';
import type QuizRepository from '../../repositories/quiz.repository.js';
import { quiz, quizId, quizInput } from '../fixtures.js';

describe('QuizService', () => {
  const repository = {
    create: jest.fn<QuizRepository['create']>(),
    findAll: jest.fn<QuizRepository['findAll']>(),
    findById: jest.fn<QuizRepository['findById']>(),
    delete: jest.fn<QuizRepository['delete']>(),
  };
  let service: QuizService;
  beforeEach(() => {
    jest.resetAllMocks();
    service = new QuizService(repository);
  });

  test('creates a quiz through its repository and returns the saved quiz', async () => {
    repository.create.mockResolvedValue(quiz);
    await expect(service.create(quizInput)).resolves.toEqual(quiz);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(quizInput);
  });
  test('returns only id, title and questionCount in the list', async () => {
    repository.findAll.mockResolvedValue([
      { id: quizId, title: quiz.title, _count: { questions: 3 } },
      { id: 'other', title: 'Empty quiz', _count: { questions: 0 } },
    ]);
    await expect(service.findAll()).resolves.toEqual([
      { id: quizId, title: quiz.title, questionCount: 3 },
      { id: 'other', title: 'Empty quiz', questionCount: 0 },
    ]);
    expect(repository.findAll).toHaveBeenCalledWith();
  });
  test('returns an empty list when there are no quizzes', async () => {
    repository.findAll.mockResolvedValue([]);
    await expect(service.findAll()).resolves.toEqual([]);
  });
  test('returns complete quiz details by id', async () => {
    repository.findById.mockResolvedValue(quiz);
    await expect(service.find(quizId)).resolves.toEqual(quiz);
    expect(repository.findById).toHaveBeenCalledWith(quizId);
  });
  test('throws 404 for a missing quiz', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.find(quizId)).rejects.toMatchObject({
      status: 404,
      message: 'Quiz not found',
    });
  });
  test('deletes an existing quiz', async () => {
    repository.delete.mockResolvedValue({ count: 1 });
    await expect(service.delete(quizId)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith(quizId);
  });
  test('throws 404 when no quiz was deleted', async () => {
    repository.delete.mockResolvedValue({ count: 0 });
    await expect(service.delete(quizId)).rejects.toMatchObject({
      status: 404,
      message: 'Quiz not found',
    });
  });
  test.each(['create', 'findAll', 'find', 'delete'] as const)(
    'propagates repository errors from %s',
    async (method) => {
      const error = new Error('Database unavailable');
      repository.create.mockRejectedValue(error);
      repository.findAll.mockRejectedValue(error);
      repository.findById.mockRejectedValue(error);
      repository.delete.mockRejectedValue(error);
      const result =
        method === 'create'
          ? service.create(quizInput)
          : method === 'findAll'
            ? service.findAll()
            : service[method](quizId);
      await expect(result).rejects.toBe(error);
    },
  );
});
