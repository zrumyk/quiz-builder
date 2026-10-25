import type { NextFunction, Request, Response } from 'express';
import type QuizService from '../services/quiz.service.js';
import type { CreateQuizInput } from '../schemas/quizzes/create.js';

class QuizController {
  constructor(private readonly quizService: QuizService) {}

  findAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.quizService.findAll();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  find = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.quizService.find(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.quizService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request<Record<string, never>, unknown, CreateQuizInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.quizService.create(req.body);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default QuizController;
