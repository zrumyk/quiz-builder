import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import QuizRepository from '../../repositories/quiz.repository.js';
import QuizService from '../../services/quiz.service.js';
import QuizController from '../../controllers/quiz.controller.js';
import { createQuizSchema } from '../../schemas/quizzes/create.js';
import validate from '../../middleware/validate.middleware.js';
import { quizParamsSchema } from '../../schemas/quizzes/params.js';
import validateParams from '../../middleware/validate-params.middleware.js';

const router = Router();

const quizRepository = new QuizRepository(prisma);
const quizService = new QuizService(quizRepository);
const quizController = new QuizController(quizService);

router.post('/', validate(createQuizSchema), quizController.create);
router.get('/', quizController.findAll);
router.get('/:id', validateParams(quizParamsSchema), quizController.find);
router.delete('/:id', validateParams(quizParamsSchema), quizController.delete);

export default router;
