import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import QuizRepository from '../../repositories/quiz.repository.js';
import QuizService from '../../services/quiz.service.js';
import QuizController from '../../controllers/quiz.controller.js';
import { createQuizSchema } from '../../schemas/quizzes/create.js';
import validate from '../../middleware/validate.middleware.js';

const router = Router();

const quizRepository = new QuizRepository(prisma);
const quizService = new QuizService(quizRepository);
const quizController = new QuizController(quizService);

router.post('/', validate(createQuizSchema), quizController.create);

export default router;