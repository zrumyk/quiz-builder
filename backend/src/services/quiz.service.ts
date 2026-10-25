import type QuizRepository from '../repositories/quiz.repository.js';
import type { CreateQuizInput } from '../schemas/quizzes/create.js';
import ApiError from '../exceptions/api.error.js';

class QuizService {
  constructor(private readonly quizRepository: QuizRepository) {}

  async findAll() {
    const quizzes = await this.quizRepository.findAll();

    return quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionCount: quiz._count.questions,
    }));
  }

  async find(id: string) {
    const quiz = await this.quizRepository.findById(id);

    if (!quiz) {
      throw ApiError.NotFound('Quiz not found');
    }

    return quiz;
  }

  async delete(id: string) {
    const result = await this.quizRepository.delete(id);

    if (result.count === 0) {
      throw ApiError.NotFound('Quiz not found');
    }
  }

  async create(data: CreateQuizInput) {
    return this.quizRepository.create(data);
  }
}

export default QuizService;
