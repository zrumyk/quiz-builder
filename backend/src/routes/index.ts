import { Router } from 'express';
import quizRoutes from './di/quiz.routes.js';

const router = Router();

router.use('/quizzes', quizRoutes);

export default router;
