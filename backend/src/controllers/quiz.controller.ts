import type { NextFunction, Request, Response } from 'express';
import type QuizService from '../services/quiz.service.js';
import type { CreateQuizInput } from '../schemas/quizzes/create.js';

class QuizController {
  constructor(private readonly quizService: QuizService) {}

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