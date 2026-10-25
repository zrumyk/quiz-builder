import type { PrismaClient } from "../generated/prisma/client.js";
import type { CreateQuizInput } from "../schemas/quizzes/create.js";

class QuizRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.quiz.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      select: {
        id: true,
        title: true,
        _count: { select: { questions: true } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { position: 'asc' },
          include: {
            options: { orderBy: { position: 'asc' } },
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.quiz.deleteMany({ where: { id } });
  }

  async create(data: CreateQuizInput) {
    return this.prisma.quiz.create({
      data: {
        title: data.title,
        questions: {
          create: data.questions.map((question, position) => ({
            text: question.text,
            type: question.type,
            position,
            booleanAnswer: question.type === "BOOLEAN" ? question.booleanAnswer : null,
            textAnswer: question.type === "INPUT" ? question.textAnswer : null,
            options:
              question.type === "CHECKBOX"
                ? {
                    create: question.options.map((option, optionPosition) => ({
                      text: option.text,
                      isCorrect: option.isCorrect,
                      position: optionPosition,
                    })),
                  }
                : undefined,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { position: "asc" },
          include: {
            options: {
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });
  }
}

export default QuizRepository;
