import type QuizRepository from '../repositories/quiz.repository.js';
import type { CreateQuizInput } from '../schemas/quizzes/create.js';

class QuizService {
  constructor(private readonly quizRepository: QuizRepository) {}

  async create(data: CreateQuizInput) {
    return this.quizRepository.create(data);
  }
}

export default QuizService;